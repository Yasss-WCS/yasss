import configparser
import os
import flask
import requests

app = flask.Flask(__name__)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' # TODO REMOVE

def load_config():
  config = configparser.ConfigParser()
  config.read('config.ini')
  return config['DEFAULT']

@app.route('/')
def index():
  return print_index_table()


@app.route('/authorize')
def authorize():
  config = load_config()
  res = requests.post(config['AuthApi'], headers={'Accept': 'application/json'})
  return flask.redirect(res.text)

def print_index_table():
  return ('<table>' +
          '<tr><td><a href="/test">Test an API request</a></td>' +
          '<td>Submit an API request and see a formatted JSON response. ' +
          '    Go through the authorization flow if there are no stored ' +
          '    credentials for the user.</td></tr>' +
          '<tr><td><a href="/authorize">Test the auth flow directly</a></td>' +
          '<td>Go directly to the authorization flow. If there are stored ' +
          '    credentials, you still might not be prompted to reauthorize ' +
          '    the application.</td></tr>' +
          '<tr><td><a href="/revoke">Revoke current credentials</a></td>' +
          '<td>Revoke the access token associated with the current user ' +
          '    session. After revoking credentials, if you go to the test ' +
          '    page, you should see an <code>invalid_grant</code> error.' +
          '</td></tr>' +
          '<tr><td><a href="/clear">Clear Flask session credentials</a></td>' +
          '<td>Clear the access token currently stored in the user session. ' +
          '    After clearing the token, if you <a href="/test">test the ' +
          '    API request</a> again, you should go back to the auth flow.' +
          '</td></tr></table>')


if __name__ == '__main__':
  # When running locally, disable OAuthlib's HTTPs verification.
  app.secret_key = 'super secret key' 
  app.config['SESSION_TYPE'] = 'filesystem'

  # Specify a hostname and port that are set as a valid redirect URI
  # for your API project in the Google API Console.
  app.run('localhost', 5000, debug=True)