import os
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request


def get_sheets_service(scopes, client_id, refresh_token):
    scopes = scopes.split(',')
    authorized_user = {'refresh_token': refresh_token, 'scopes': scopes,
                       'client_id': client_id, 'client_secret': os.getenv('client_secret')}
    creds = Credentials.from_authorized_user_info(authorized_user, scopes)
    creds.refresh(Request())
    return build('sheets', 'v4', credentials=creds).spreadsheets()