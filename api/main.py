import flask
from yass_api import YasssApi


def run(request: flask.Request):
    token = request.cookies.get('sessionID')
    spreadsheet_id = request.args.get('spreadsheet_id')
    action = request.args.get('action')
    role = request.args.get('role')
    division = request.args.get('division')
    rnd = request.args.get('round')
    judge_name = request.args.get('judge_name')
    event_name = request.args.get('event_name')
    yass_api = YasssApi(token=token, spreadsheet_id=spreadsheet_id)
    if action is None:
        if request.args.get('code') is not None:
            return yass_api.oauth2callback()
        else:
            return yass_api.index()
    if action == 'login' and request.method == 'GET':
        return yass_api.login()
    if action == 'logout' and request.method == 'GET':
        return yass_api.logout(token)
    if action == 'add_judge' and request.method == 'POST':
        return yass_api.add_judge(spreadsheet_id, judge_name)
    if action == 'remove_judge' and request.method == 'POST':
        return yass_api.remove_judge(spreadsheet_id, judge_name)
    if action == 'create_event' and request.method == 'POST':
        return yass_api.create_event(event_name)
    if action == 'get_scores' and request.method == 'GET':
        return yass_api.get_scores(spreadsheet_id, division, rnd, role)
    if action == 'get_placements' and request.method == 'GET':
        return yass_api.get_relative_placements(spreadsheet_id, division, rnd, role)
    if action == 'get_competitors' and request.method == 'GET':
        return yass_api.get_competitors(spreadsheet_id, division, rnd, role)
    if action == 'get_events' and request.method == 'GET':
        return yass_api.get_events()
    if action == 'submit_scores' and request.method == 'POST':
        scores = request.get_json()
        return yass_api.submit_scores(spreadsheet_id, division, rnd, role, judge_name, scores)
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
