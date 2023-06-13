import flask

from yass_api import YasssApi


def run(request: flask.Request):
    token = request.cookies.get('sessionID')
    action = request.args.get('action')
    yass_api = YasssApi(token)
    if action is None:
        if request.args.get('code') is not None:
            return yass_api.oauth2callback()
        else:
            return yass_api.index()
    if action == 'login':
        return yass_api.login()
    if action == 'logout':
        return yass_api.logout(token)
    if yass_api.user is None:
        return yass_api.login()
    if action == 'add_judge':
        return yass_api.add_judge(request.args.get('spreadsheet_id'), request.args.get('judge_name'))
    if action == 'remove_judge':
        return yass_api.remove_judge(request.args.get('spreadsheet_id'), request.args.get('judge_name'))
    if action == 'create':
        return yass_api.create_event(request.args.get('name'))
    return flask.abort(404)

#  TODO How to handle people renaming sheets?
#  TODO How to handle people breaking formatting?
#  TODO Use a proper router.
#  TODO Display all events
#  TODO Use GET/POST/PUT properly.
#  TODO Split code up into separate files.
#  TODO Create tabs on sheet creation
#  TODO Use Optional for User
#  TODO Handle retries
