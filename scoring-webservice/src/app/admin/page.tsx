'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

//import Menu from '@mui/icons-material/Menu'

import { Yasss } from '../../modules/DanceEvent';

// test data
const DanceEvent : Yasss.DanceEvent = new Yasss.DanceEvent("");

const Competition1 : Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Novice);
const Competition2 : Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Intermediate);
const Competition3 : Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Advanced);
const Competitions : Yasss.Competition[] = [Competition1, Competition2, Competition3];


function CompetitionCard(props: {competition: Yasss.Competition}) {
    return (
        <Card variant="outlined">
            <div>Competition:</div>
            <div>{props.competition.Name}</div>
            <div>{props.competition.Division}</div>
        </Card>
    )
}

function Header(props: {danceEvent: Yasss.DanceEvent}) {
    return (
        <AppBar position="static">
            <Toolbar variant="regular">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <div>menu</div>
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    {props.danceEvent.Name}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default function admin() {
    let danceEvent = DanceEvent;
    let competitions = Competitions;

    let competitionList = competitions.map((competition : Yasss.Competition) => {
       return <CompetitionCard competition={competition}/>; 
    });

    return (
        <main>
            <Header danceEvent={danceEvent}/>
            <ul>
                {competitionList}
            </ul>
        </main>
    )
}