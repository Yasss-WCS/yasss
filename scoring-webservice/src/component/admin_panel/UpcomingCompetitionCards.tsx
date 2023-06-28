import UpcomingCompetitionCard from './UpcomingCompetitionCard';

import { Yasss } from '../../modules/DanceEvent';
import { useState } from 'react';

export default function UpcomingCompetitionCards(props: {competitions: Array<Yasss.Competition>}){
    if (props.competitions.length < 1)
        return;

    const [upcomingCompetitions, setUpcomingCompetitions] = useState(props.competitions);

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
