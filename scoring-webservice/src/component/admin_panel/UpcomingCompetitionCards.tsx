import UpcomingCompetitionCard from './UpcomingCompetitionCard';

import { Yasss } from '../../modules/DanceEvent';
import { useContext } from 'react';

import { UpcomingCompetitionsContext } from './AdminPanel';

export default function UpcomingCompetitionCards(){
    const upcomingCompetitions = useContext(UpcomingCompetitionsContext);

    if (upcomingCompetitions.length < 1)
        return;

    let competitionList = upcomingCompetitions.map((competition : Yasss.Competition) => {
        return <UpcomingCompetitionCard key="{competition}" competition={competition}/> 
    });

    return (
        <div>
            <div>UPCOMING:</div>
            {competitionList}
        </div>
    )
}
