import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { Yasss } from '../../modules/DanceEvent';
import { useState, useContext } from 'react';

import { CurrentCompetitionsContext, StagingCompetitionsContext, UpcomingCompetitionsContext } from './AdminPanel';

export default function CompetitionCard(props: {competition: Yasss.Competition}) {
    const [competition, setCompetition] = useState(props.competition);

    let currentCompetitions = useContext(CurrentCompetitionsContext);
    let stagingCompetitions = useContext(StagingCompetitionsContext);
    let upcomingCompetitions = useContext(UpcomingCompetitionsContext);

    const StageCompetition = () => {
        upcomingCompetitions = upcomingCompetitions.filter(e => e !== competition);
        stagingCompetitions.push(competition);
    };
    const UnstageCompetition = () => {
        stagingCompetitions = stagingCompetitions.filter(e => e !== competition);
        upcomingCompetitions.unshift(competition);
    };

    // todo: add property for card type?
    let cardType = "";
    
    let button;
    if (cardType == "Current") {
        button = () => {
        };
    }
    else if (cardType == "Staging"){
        button = () => {
            <Button variant="contained" onClick={() => {UnstageCompetition()}}>Unstage</Button>
        }
    }
    else if (cardType == "Upcoming"){
        button = () => {
            <Button variant="contained" onClick={() => {StageCompetition()}}>Stage</Button>
        }
    }

    return (
        <Card variant="outlined">
            <div>{competition.Name} - {competition.Division}</div>
            <div>{competition.Round}</div>
            <div>Leaders: {competition.GetLeaderCount()}</div>
            <div>Followers: {competition.GetFollowerCount()}</div>
        </Card>
    )
}