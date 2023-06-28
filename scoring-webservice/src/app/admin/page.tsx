'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import Menu from '@mui/icons-material/Menu'

import { Yasss } from '../../modules/DanceEvent';

// test data
const DanceEvent: Yasss.DanceEvent = new Yasss.DanceEvent("Liberty Swing 2023");

const Competition1: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Novice, Yasss.Round.Prelims);
const Competition2: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Intermediate, Yasss.Round.Prelims);
const Competition3: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Advanced, Yasss.Round.Prelims);
const Competition4: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.AllStar, Yasss.Round.Prelims);
const Competitions: Yasss.Competition[] = [Competition1, Competition2, Competition3, Competition4];

const CurrentCompetitions: Yasss.Competition[] = [Competition1];
const StagingCompetitions: Yasss.Competition[] = [Competition2];
const UpcomingCompetitions: Yasss.Competition[] = [Competition3, Competition4];

function StageCompetition(competition : Yasss.Competition) {
    // TODO: move competition card up into staging zone
}

function UnStageCompetition(competition : Yasss.Competition) {
    // TODO: move competition card down from staging back into upcoming zone
}

function StageCompetitionButton(props: {competition: Yasss.Competition}) {
    return (
        <Button variant="contained" onClick={() => {StageCompetition(props.competition)}}>Stage</Button>
    )
}

function UnStageCompetitionButton(props: {competition: Yasss.Competition}) {
    return (
        <Button variant="contained" onClick={() => {UnStageCompetition(props.competition)}}>Unstage</Button>
    )
}

function CurrentCompetitionCard(props: {competition: Yasss.Competition}) {
    return (
        <Card variant="outlined">
            <div>{props.competition.Name} - {props.competition.Division}</div>
            <div>{props.competition.Round}</div>
            <div>Leaders: {props.competition.GetLeaderCount()}</div>
            <div>Followers: {props.competition.GetFollowerCount()}</div>
        </Card>
    )
}

function StagingCompetitionCard(props: {competition: Yasss.Competition}) {
    return (
        <Card variant="outlined">
            <div>{props.competition.Name} - {props.competition.Division}</div>
            <div>{props.competition.Round}</div>
            <div>Leaders: {props.competition.GetLeaderCount()}</div>
            <div>Followers: {props.competition.GetFollowerCount()}</div>
            <UnStageCompetitionButton competition={props.competition}/>
        </Card>
    )
}

function UpcomingCompetitionCard(props: {competition: Yasss.Competition}) {
    return (
        <Card variant="outlined">
            <div>{props.competition.Name} - {props.competition.Division}</div>
            <div>{props.competition.Round}</div>
            <div>Leaders: {props.competition.GetLeaderCount()}</div>
            <div>Followers: {props.competition.GetFollowerCount()}</div>
            <StageCompetitionButton competition={props.competition}/>
        </Card>
    )
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

function DisplayCurrentCompetitions(props: {competitions: Array<Yasss.Competition>}){
    if (props.competitions.length < 1)
        return;

    let competitionList = props.competitions.map((competition : Yasss.Competition) => {
        return <CurrentCompetitionCard key="{competition}" competition={competition}/> 
    });

    return (
        <div>
            <div>CURRENT:</div>
            {competitionList}
        </div>
    )
}

function DisplayStagingCompetitions(props: {competitions: Array<Yasss.Competition>}){
    if (props.competitions.length < 1)
        return;

    let competitionList = props.competitions.map((competition : Yasss.Competition) => {
        return <StagingCompetitionCard key="{competition}" competition={competition}/> 
    });

    return (
        <div>
            <div>STAGING:</div>
            {competitionList}
        </div>
    )
}

function DisplayUpcomingCompetitions(props: {competitions: Array<Yasss.Competition>}){
    if (props.competitions.length < 1)
        return;

    let competitionList = props.competitions.map((competition : Yasss.Competition) => {
        return <UpcomingCompetitionCard key="{competition}" competition={competition}/> 
    });

    return (
        <div>
            <div>UPCOMING:</div>
            {competitionList}
        </div>
    )
}

export default function admin() {
    let danceEvent = DanceEvent;

    return (
        <main>
            <Header danceEvent={danceEvent}/>
            <DisplayCurrentCompetitions competitions={CurrentCompetitions}/>
            <DisplayStagingCompetitions competitions={StagingCompetitions}/>
            <DisplayUpcomingCompetitions competitions={UpcomingCompetitions}/>
        </main>
    )
}