import os
import json
import flask
import configparser
import google_auth_oauthlib.flow
import googleapiclient.discovery
from google.cloud import datastore
import uuid
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # TODO REMOVE


def get_sheets_service(config, refresh_token):
    with open('client_secret.json', 'r') as file:
        credentials = json.load(file)
    installed = credentials['installed']
    scopes = config['Scopes'].split(',')
    authorized_user = {'refresh_token': refresh_token, 'scopes': scopes,
                       'client_id': installed['client_id'], 'client_secret': installed['client_secret']}
    creds = Credentials.from_authorized_user_info(authorized_user, scopes)
    creds.refresh(Request())
    return build('sheets', 'v4', credentials=creds).spreadsheets()


def create_sheet(config, refresh_token, event_name):
    service = get_sheets_service(config, refresh_token)
    spreadsheet = service.create(
        body={'properties': {'title': event_name}}
    ).execute()
    sheet_id = spreadsheet['spreadsheetId']
    return sheet_id


def add_judge(config, user, sheet_id, judge_name):
    sheets_service = get_sheets_service(config, user['refresh_token'])
    range_ = 'Judges'  # Sheet name
    value_input_option = 'USER_ENTERED'  # Other option is 'RAW'
    insert_data_option = 'INSERT_ROWS'  # The other options are 'OVERWRITE' and 'INSERT_ROWS'
    values = [[judge_name]]
    value_range_body = {
        'majorDimension': 'ROWS',
        'values': values
    }

    sheets_service.values().append(
        spreadsheetId=sheet_id,
        range=range_,
        valueInputOption=value_input_option,
        insertDataOption=insert_data_option,
        body=value_range_body
    ).execute()
    return flask.redirect('/')


def get_session(ds_client, token):
    query = ds_client.query(kind='Session')
    query.add_filter('token', '=', token)
    return list(query.fetch())


def get_refresh_token(ds_client, email):
    query = ds_client.query(kind='User')
    query.add_filter('email', '=', email)
    return list(query.fetch())[0]['refresh_token']


def create_event(config, user, event_name):
    client = datastore.Client(config['ProjectId'])
    event_key = client.key('Event')
    event = datastore.Entity(key=event_key)
    event['email'] = user['email']
    event['event_name'] = event_name
    event['sheet_id'] = create_sheet(config, user['refresh_token'], event_name)
    client.put(event)
    return event['sheet_id']


def create_session(config, email):
    expiration_time = datetime.now() + timedelta(days=7)
    token = str(uuid.uuid4())
    client = datastore.Client(config['ProjectId'])
    key = client.key('Session')
    session = datastore.Entity(key=key)
    session['email'] = email
    session['token'] = token
    session['expiration_time'] = expiration_time
    client.put(session)
    return token


def load_config():
    config = configparser.ConfigParser()
    config.read('config.ini')
    # TODO Support prod config
    return config['DEFAULT']


def delete_session(config, token):
    client = datastore.Client(config['ProjectId'])
    query = client.query(kind='Session')
    query.add_filter('token', '=', token)
    results = list(query.fetch())

    if results:
        client.delete(results[0].key)


def get_user(config, token):
    client = datastore.Client(config['ProjectId'])
    session = get_session(client, token)
    if len(session) == 0:
        return []
    email = session[0]['email']
    query = client.query(kind='User')
    query.add_filter('email', '=', email)
    return list(query.fetch())


def get_or_create_user(config, email, refresh_token):
    client = datastore.Client(config['ProjectId'])
    # initialize the new Event
    query = client.query(kind='User')
    query.add_filter('email', '=', email)
    results = list(query.fetch())

    if results:
        # The user already exists in the datastore.
        user = results[0]
    else:
        # The user doesn't exist in the datastore, so we'll create a new User.
        key = client.key('User')
        user = datastore.Entity(key=key)
        user['email'] = email
        user['refresh_token'] = refresh_token
        client.put(user)

    return user


def build_flow(config):
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        config['ClientsSecret'], scopes=config['Scopes'].split(','))
    flow.redirect_uri = config['AuthApi']
    return flow


def login(config):
    flow = build_flow(config)
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='false')
    return flask.redirect(authorization_url)


def oauth2callback(config):
    flow = build_flow(config)
    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)
    creds = flow.credentials
    service = googleapiclient.discovery.build('oauth2', 'v2', credentials=creds)
    user_info = service.userinfo().get().execute()
    email = str(user_info['email'])
    refresh_token = str(flow.credentials.refresh_token)
    get_or_create_user(config, email, refresh_token)
    response = flask.make_response(flask.redirect(config['Site']))
    token = create_session(config, email)
    response.set_cookie('sessionID', token, secure=True, httponly=True, samesite='Lax')
    return response


def logout(config, token):
    delete_session(config, token)
    response = flask.make_response(flask.redirect(config['Site']))
    response.delete_cookie('sessionID')
    return response


def get_events(config, user):
    client = datastore.Client(config['ProjectId'])
    query = client.query(kind='Event')
    query.add_filter('email', '=', user['email'])
    res = query.fetch()
    events = list(res)
    return events


def run(request: flask.Request):
    config = load_config()
    token = request.cookies.get('sessionID')
    action = request.args.get('action')
    user = get_user(config, token)
    if action is None:
        if request.args.get('code') is not None:
            return oauth2callback(config)
        else:
            return index(config, user)
    if action == 'login':
        return login(config)
    if action == 'logout':
        return logout(config, token)
    if len(user) == 0:
        return login(config)
    else:
        user = user[0]
    if action == 'add_judge':
        return add_judge(config, user, request.args.get('sheet_id'), request.args.get('judge_name'))
    if action == 'create':
        return create_event(config, user, request.args.get('name'))
    return flask.abort(404)


def add_judge_display(event_list):
    base_html = """
    <h1>Add Judge</h1>
    <select id="eventName">
    {options}
    </select>
    <input type="text" id="judgeName" placeholder="Enter judge name">
    <button id="submitBtn">Submit</button>
    """

    base_js = """
    <script>
    document.getElementById('submitBtn').addEventListener('click', function() {
        // Get the user's selections
        var eventName = document.getElementById('eventName').value;
        var judgeName = document.getElementById('judgeName').value;

        // Build the URL
        var url = "/?action=add_judge&sheet_id=" + encodeURIComponent(eventName) + "&judge_name=" + encodeURIComponent(judgeName);

        // Redirect to the new page
        window.location.href = url;
    });
    </script>
    """

    options = ""
    for event in event_list:
        options += f'<option value="{event["sheet_id"]}">{event["event_name"]}</option>\n'

    return base_html.format(options=options) + base_js


def index(config, user):
    if len(user) == 0:
        events_list = ''
        events = []
    else:
        events = get_events(config, user[0])
        events_list = str.join("\n", [f"<li>{event['event_name']} - {event['sheet_id']}</li>" for event in events])
    return(
        f'''
        <ul>
        <li><a href="/?action=login">Admin Log In</a></li>
        <li><a href="/?action=create&name=TestEvent">Create a test event</a></li>
        <li><a href="/?action=logout">Admin Log Out</a></li>
        {add_judge_display(events)}
        {events_list}
        ''')

#  TODO How to handle people renaming sheets?
#  TODO How to handle people breaking formatting?
#  TODO Use a proper router.
#  TODO Display all events
#  TODO Use GET/POST/PUT properly.
#  TODO Split code up into separate files.
#  TODO Create tabs on sheet creation
#  TODO Use Optional for User
#  TODO Handle retries
