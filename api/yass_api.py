import os
import flask
import configparser
import google_auth_oauthlib.flow
import googleapiclient.discovery
from google.cloud import datastore
import uuid
from datetime import datetime, timedelta

from client_helpers import get_sheets_service
from html_helpers import build_index
from scoring_helpers import calculate_relative_placement

email_to_sheets_client = {}
ds_client = None


class YasssApi:
    def __init__(self, token=None, spreadsheet_id=None):
        global email_to_sheets_client
        global ds_client
        self.token = token
        self.config = self.load_config()
        if ds_client is None:
            ds_client = datastore.Client(self.config['ProjectId'])
        self.ds_client = ds_client
        if token is not None:
            user = self.get_user_by_token(token)
        elif spreadsheet_id is not None:
            email = self.get_spreadsheet_owner(spreadsheet_id)
            user = self.get_user_by_email(email)
        else:
            raise Exception("Token or Spreadsheet Id must be set")
        if not len(user) == 0:
            self.user = user[0]
            email = self.user['email']
            if self.user['email'] not in email_to_sheets_client:
                email_to_sheets_client[email] = get_sheets_service(self.config['Scopes'], self.config['ClientId'],
                                                                   self.user['refresh_token'])
            self.sheets_client = email_to_sheets_client[email]
        else:
            self.user = None
            self.sheets_client = None
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # TODO REMOVE

    def get_competitors(self, spreadsheet_id, division, rnd, role):
        result = self.sheets_client.values().get(
            spreadsheetId=spreadsheet_id,
            range='Competitors'
        ).execute()

        return [row[0] for row in result.get('values', [])[1:] if row and row[1] == division and row[2] == role
                and row[3 == rnd]]

    def get_scores(self, spreadsheet_id, division, rnd, role):
        result = self.sheets_client.values().get(
            spreadsheetId=spreadsheet_id,
            range='Scores'
        ).execute()

        ret = {}

        scores = [row for row in result.get('values', [])[1:] if row and row[1] == division and row[2] == role
                  and row[3 == rnd]]
        for score in scores:
            competitor_name = score[0]
            if competitor_name not in ret:
                ret[competitor_name] = {}
            competitor_dict = ret[competitor_name]
            judge_name = score[4]
            if judge_name in competitor_dict:
                competitor_dict[judge_name] = -1
            else:
                competitor_dict[judge_name] = score[5]
        return ret

    def get_relative_placements(self, spreadsheet_id, division, rnd, role):
        scores = self.get_scores(spreadsheet_id, division, rnd, role)
        ret = {}
        relative_placements = calculate_relative_placement(scores)
        for key in scores.keys():
            ret[key] = {}
            ret[key]['Scores'] = scores[key]
            ret[key]['Placement'] = relative_placements[key]
            ret[key]['Name'] = key
        return sorted([ret[k] for k in ret.keys()], key=lambda score: score['Placement'])

    def submit_scores(self, spreadsheet_id, division, rnd, role, judge_name, scores):
        range_ = 'Scores'  # Sheet name
        value_input_option = 'USER_ENTERED'  # Other option is 'RAW'
        insert_data_option = 'INSERT_ROWS'  # The other options are 'OVERWRITE' and 'INSERT_ROWS'
        values = [[competitor, division, role, rnd, judge_name, scores[competitor]] for competitor in scores.keys()]
        value_range_body = {
            'majorDimension': 'ROWS',
            'values': values
        }

        self.sheets_client.values().append(
            spreadsheetId=spreadsheet_id,
            range=range_,
            valueInputOption=value_input_option,
            insertDataOption=insert_data_option,
            body=value_range_body
        ).execute()
        return 'Success'

    def create_sheet(self, event_name):
        spreadsheet = self.sheets_client.create(
            body={'properties': {'title': event_name}}
        ).execute()
        spreadsheet_id = spreadsheet['spreadsheetId']
        return spreadsheet_id

    def remove_judge(self, spreadsheet_id, judge_name):

        # Request all data from the sheet named 'Judges'
        result = self.sheets_client.values().get(
            spreadsheetId=spreadsheet_id,
            range='Judges'
        ).execute()

        values = result.get('values', [])

        # Find rows where the first column matches search_string
        matching_rows = [i for i, row in enumerate(values) if row and row[0] == judge_name]

        # If there are matching rows, construct a batch update request to delete them
        if matching_rows:
            requests = [{
                'deleteDimension': {
                    'range': {
                        'sheetId': self.get_sheet_ids(spreadsheet_id)['Judges'],
                        'dimension': 'ROWS',
                        'startIndex': row,
                        'endIndex': row + 1
                    }
                }
            } for row in reversed(matching_rows)]  # Reversed to prevent messing up indices after deletion

            body = {
                'requests': requests
            }

            # Execute the requests
            self.sheets_client.batchUpdate(
                spreadsheetId=spreadsheet_id,
                body=body
            ).execute()
        return flask.redirect('/')

    def get_sheet_ids(self, spreadsheet_id):
        result = self.sheets_client.get(
            spreadsheetId=spreadsheet_id
        ).execute()

        sheets = result.get('sheets', [])
        sheet_ids = {sheet['properties']['title']: sheet['properties']['sheetId'] for sheet in sheets}

        return sheet_ids

    def add_judge(self, spreadsheet_id, judge_name):
        range_ = 'Judges'  # Sheet name
        value_input_option = 'USER_ENTERED'  # Other option is 'RAW'
        insert_data_option = 'INSERT_ROWS'  # The other options are 'OVERWRITE' and 'INSERT_ROWS'
        values = [[judge_name]]
        value_range_body = {
            'majorDimension': 'ROWS',
            'values': values
        }

        self.sheets_client.values().append(
            spreadsheetId=spreadsheet_id,
            range=range_,
            valueInputOption=value_input_option,
            insertDataOption=insert_data_option,
            body=value_range_body
        ).execute()
        return flask.redirect('/')

    def get_session(self, token):
        query = self.ds_client.query(kind='Session')
        query.add_filter('token', '=', token)
        return list(query.fetch())

    def get_refresh_token(self, email):
        query = self.ds_client.query(kind='User')
        query.add_filter('email', '=', email)
        return list(query.fetch())[0]['refresh_token']

    def get_spreadsheet_owner(self, spreadsheet_id):
        query = self.ds_client.query(kind='Event')
        query.add_filter('spreadsheet_id', '=', spreadsheet_id)
        return list(query.fetch())[0]['email']

    def create_event(self, event_name):
        event_key = self.ds_client.key('Event')
        event = datastore.Entity(key=event_key)
        event['email'] = self.user['email']
        event['event_name'] = event_name
        event['spreadsheet_id'] = self.create_sheet(event_name)
        self.ds_client.put(event)
        return event['spreadsheet_id']

    def create_session(self, email):
        expiration_time = datetime.now() + timedelta(days=7)
        token = str(uuid.uuid4())
        key = self.ds_client.key('Session')
        session = datastore.Entity(key=key)
        session['email'] = email
        session['token'] = token
        session['expiration_time'] = expiration_time
        self.ds_client.put(session)
        return token

    @staticmethod
    def load_config():
        config = configparser.ConfigParser()
        config.read('config.ini')
        stage = os.getenv('Stage')
        if stage is not None:
            config.read(f'config-{stage}.ini')
        return config['DEFAULT']

    def delete_session(self, token):
        query = self.ds_client.query(kind='Session')
        query.add_filter('token', '=', token)
        results = list(query.fetch())

        if results:
            self.ds_client.delete(results[0].key)

    def get_user_by_token(self, token):
        session = self.get_session(token)
        if len(session) == 0:
            return []
        email = session[0]['email']
        query = self.ds_client.query(kind='User')
        query.add_filter('email', '=', email)
        return list(query.fetch())

    def get_user_by_email(self, email):
        query = self.ds_client.query(kind='User')
        query.add_filter('email', '=', email)
        return list(query.fetch())

    def get_or_create_user(self, email, refresh_token):
        # initialize the new Event
        results = self.get_user_by_email(email)

        if results:
            # The user already exists in the datastore.
            user = results[0]
        else:
            # The user doesn't exist in the datastore, so we'll create a new User.
            key = self.ds_client.key('User')
            user = datastore.Entity(key=key)
            user['email'] = email
            user['refresh_token'] = refresh_token
            self.ds_client.put(user)

        return user

    def build_flow(self):
        flow = google_auth_oauthlib.flow.Flow.from_client_config(
            {'installed': {
                'client_secret': os.getenv('client_secret'),
                "client_id": self.config['ClientId'],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://accounts.google.com/o/oauth2/token"
            }}, scopes=self.config['Scopes'].split(','))
        flow.redirect_uri = self.config['AuthApi']
        return flow

    def login(self):
        flow = self.build_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            # Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes='false')
        return flask.redirect(authorization_url)

    def oauth2callback(self):
        flow = self.build_flow()
        authorization_response = flask.request.url
        flow.fetch_token(authorization_response=authorization_response)
        creds = flow.credentials
        service = googleapiclient.discovery.build('oauth2', 'v2', credentials=creds)
        user_info = service.userinfo().get().execute()
        email = str(user_info['email'])
        refresh_token = str(flow.credentials.refresh_token)
        self.get_or_create_user(email, refresh_token)
        response = flask.make_response(flask.redirect(self.config['Site']))
        token = self.create_session(email)
        response.set_cookie('sessionID', token, secure=True, httponly=True, samesite='Lax')
        return response

    def logout(self, token):
        self.delete_session(token)
        response = flask.make_response(flask.redirect(self.config['Site']))
        response.delete_cookie('sessionID')
        return response

    def get_events(self):
        if self.user is None:
            return []
        query = self.ds_client.query(kind='Event')
        query.add_filter('email', '=', self.user['email'])
        res = query.fetch()
        events = list(res)
        return events

    def index(self):
        return build_index(self.config['UrlPrefix'], self.user, self.get_events())
