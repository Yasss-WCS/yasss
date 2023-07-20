import StagingCompetitionCard from './StagingCompetitionCard';

import { Yasss } from '../../modules/DanceEvent';
import { useContext } from 'react';

import { StagingCompetitionsContext } from './AdminPanel';


export default function StagingCompetitionCards(){
    const stagingCompetitions = useContext(StagingCompetitionsContext);
    
    if (stagingCompetitions.length < 1)
        return;

    let competitionList = stagingCompetitions.map((competition : Yasss.Competition) => {
        return <StagingCompetitionCard key="{competition}" competition={competition}/> 
    });

    return (
        <div>
            <div>STAGING:</div>
            {competitionList}
        </div>
    )
}