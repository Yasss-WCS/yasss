import flask
from yass_api import YasssApi


def run(request: flask.Request):
    token = request.cookies.get('sessionID')
    spreadsheet_id = request.args.get('spreadsheet_id')
    action = request.args.get('action')
    role = request.args.get('role')
    division = request.args.get('division')
    rnd = request.args.get('round')
    yass_api = YasssApi(token=token, spreadsheet_id=spreadsheet_id)
    if action is None:
        if request.args.get('code') is not None:
            return yass_api.oauth2callback()
        else:
            return yass_api.index()
    if action == 'login':
        return yass_api.login()
    if action == 'logout':
        return yass_api.logout(token)
    if action == 'add_judge':
        return yass_api.add_judge(spreadsheet_id, request.args.get('judge_name'))
    if action == 'remove_judge':
        return yass_api.remove_judge(spreadsheet_id, request.args.get('judge_name'))
    if action == 'create':
        return yass_api.create_event(request.args.get('name'))
    if action == 'get_scores':
        return yass_api.get_scores(spreadsheet_id, division, rnd, role)
    if action == 'get_placements':
        return yass_api.get_relative_placements(spreadsheet_id, division, rnd, role)
    if action == 'get_competitors':
        return yass_api.get_competitors(spreadsheet_id, division, rnd, role)
    if action == 'get_scores':
        return yass_api.get_competitors(spreadsheet_id, division, rnd, role)
    if action == 'submit_scores':
        judge_name = request.args.get('judge_name')
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
