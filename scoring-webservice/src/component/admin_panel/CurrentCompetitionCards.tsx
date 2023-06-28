import CurrentCompetitionCard from './CurrentCompetitionCard';

import { Yasss } from '../../modules/DanceEvent';
import { useState } from 'react';

export default function CurrentCompetitionCards(props: {competitions: Array<Yasss.Competition>}){
    if (props.competitions.length < 1)
        return;

    const [currentCompetitions, setCurrentCompetitions] = useState(props.competitions);

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