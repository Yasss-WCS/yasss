import Card from '@mui/material/Card';

import { Yasss } from '../../modules/DanceEvent';
import { useState } from 'react';

export default function CurrentCompetitionCard(props: {competition: Yasss.Competition}) {
    const [competition, setCompetition] = useState(props.competition);

    return (
        <Card variant="outlined">
            <div>{competition.Name} - {competition.Division}</div>
            <div>{competition.Round}</div>
            <div>Leaders: {competition.GetLeaderCount()}</div>
            <div>Followers: {competition.GetFollowerCount()}</div>
        </Card>
    )
}