def build_index(url_prefix, user, events):
    if len(events) == 0:
        events_list = ''
    else:
        events_list = str.join("\n",
                               [f"<li>{event['event_name']} - {event['spreadsheet_id']}</li>" for event in events])
    if user is None:
        email = 'Nobody'
    else:
        email = user['email']
    return (
        f'''
        <h1>Logged in as {email}</h1>
        <h1>Basic Actions</h1>
        <ul>
        <li><a href="{url_prefix}?action=login">Admin Log In</a></li>
        <li><a href="{url_prefix}?action=logout">Admin Log Out</a></li>
        </ul>
        {update_judge_display(url_prefix, events, 'add')}
        {update_judge_display(url_prefix, events, 'remove')}
        {create_event_display(url_prefix)}
        <h1>Events</h1>
        <ul>
        {events_list}
        </ul>
        ''')


def create_event_display(url_prefix):
    base_html = f"""
    <h1>Create Event</h1>
    <input type="text" id="createEventName" placeholder="Enter event name">
    <button id="submitEventBtn">Submit</button>
    """
    base_js = f"""
    <script>
    document.getElementById('submitEventBtn').addEventListener('click', function() {{
        // Get the user's selections
        var eventName = document.getElementById('createEventName').value;

        // Build the URL
        fetch(`{url_prefix}?action=create_event&event_name=${{encodeURIComponent(eventName)}}`, {{method: "POST"}})
        .then(jsonData => window.location.reload());
    }});
    </script>
    """

    return base_html + base_js


def update_judge_display(url_prefix, events, prefix: str):
    base_html = f"""
    <h1>{prefix.capitalize()} Judge</h1>
    <select id="eventName">
    {{options}}
    </select>
    <input type="text" id="judgeName{prefix}" placeholder="Enter judge name">
    <button id="submitBtn{prefix}">Submit</button>
    """

    base_js = f"""
    <script>
    document.getElementById('submitBtn{prefix}').addEventListener('click', function() {{
        // Get the user's selections
        var eventName = document.getElementById('eventName').value;
        var judgeName = document.getElementById('judgeName{prefix}').value;

        // Build the URL
        fetch(`{url_prefix}?action={prefix}_judge&judge_name=${{encodeURIComponent(judgeName)}}`, {{method: "POST"}})
        .then(jsonData => window.location.reload());
    }});
    </script>
    """

    options = ""
    for event in events:
        options += f'<option value="{event["spreadsheet_id"]}">{event["event_name"]}</option>\n'

    return base_html.format(options=options) + base_js