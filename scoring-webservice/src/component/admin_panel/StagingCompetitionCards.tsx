import StagingCompetitionCard from './StagingCompetitionCard';

import { Yasss } from '../../modules/DanceEvent';
import { useState } from 'react';

export default function StagingCompetitionCards(props: {competitions: Array<Yasss.Competition>}){
    if (props.competitions.length < 1)
        return;

    const [stagingCompetitions, setStagingCompetitions] = useState(props.competitions);

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