import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { Yasss } from '../../modules/DanceEvent';
import { useState, useContext } from 'react';

import { StagingCompetitionsContext, UpcomingCompetitionsContext } from './AdminPanel';

export default function StagingCompetitionCard(props: {competition: Yasss.Competition}) {
    const [competition, setCompetition] = useState(props.competition);

    let stagingCompetitions = useContext(StagingCompetitionsContext);
    let upcomingCompetitions = useContext(UpcomingCompetitionsContext);

    const UnstageCompetition = () => {
        stagingCompetitions = stagingCompetitions.filter(e => e !== competition);
        upcomingCompetitions.unshift(competition);
    };

    return (
        <Card variant="outlined">
            <div>{competition.Name} - {competition.Division}</div>
            <div>{competition.Round}</div>
            <div>Leaders: {competition.GetLeaderCount()}</div>
            <div>Followers: {competition.GetFollowerCount()}</div>
            <Button variant="contained" onClick={() => {UnstageCompetition()}}>Unstage</Button>
        </Card>
    )
}