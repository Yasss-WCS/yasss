import os
import flask
import configparser
import google_auth_oauthlib.flow
import googleapiclient.discovery
from google.cloud import datastore

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # TODO REMOVE
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'  # TODO REMOVE

def load_config():
    config = configparser.ConfigParser()
    config.read('config.ini')
    # TODO Add prod config
    return config['DEFAULT']

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

def authorize(config):
    flow = build_flow(config)
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        approval_prompt='force',  #TODO Remove this?
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true')
    return authorization_url

def oauth2callback(config):
    flow = build_flow(config)
    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)
    creds = flow.credentials
    service = googleapiclient.discovery.build('oauth2', 'v2', credentials=creds)
    user_info = service.userinfo().get().execute()
    email = user_info['email']
    refresh_token = flow.credentials.refresh_token
    get_or_create_user(config, email, refresh_token)
    return flask.redirect(config['WebApi'])

def run(request):
    config = load_config()
    if len(request.args) == 0:
        return authorize(config)
    else:
        return oauth2callback(config)