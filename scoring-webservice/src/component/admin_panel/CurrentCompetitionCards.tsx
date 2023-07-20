import CurrentCompetitionCard from './CurrentCompetitionCard';

import { Yasss } from '../../modules/DanceEvent';
import { useContext } from 'react';

import { CurrentCompetitionsContext } from './AdminPanel';

export default function CurrentCompetitionCards(){
    const currentCompetitions = useContext(CurrentCompetitionsContext);
    
    if (currentCompetitions.length < 1)
        return;

    let competitionList = currentCompetitions.map((competition : Yasss.Competition) => {
        return <CurrentCompetitionCard key="{competition}" competition={competition}/> 
    });

    return (
        <div>
            <div>CURRENT:</div>
            {competitionList}
        </div>
    )
}