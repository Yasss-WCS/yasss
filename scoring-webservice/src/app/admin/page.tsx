'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Menu from '@mui/icons-material/Menu'

import AdminPanel from '../../component/admin_panel/AdminPanel';

import { Yasss } from '../../modules/DanceEvent';

// test data
const DanceEvent: Yasss.DanceEvent = new Yasss.DanceEvent("Liberty Swing 2023");

// todo
function GetCurrentDanceEvent() : Yasss.DanceEvent {
    return DanceEvent;
}
//todo
function GetCurrentCompetitions() : Array<Yasss.Competition> {
    return new Array<Yasss.Competition>;
}

function Header(props: {danceEvent: Yasss.DanceEvent}) {
    return (
        <AppBar position="static">
            <Toolbar variant="regular">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <Menu />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    {props.danceEvent.Name}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default function admin() {
    let danceEvent = GetCurrentDanceEvent();
    let competitions = GetCurrentCompetitions();

    return (
        <main>
            <Header danceEvent={danceEvent}/>
            <AdminPanel competitions={competitions}/>
        </main>
    )
}