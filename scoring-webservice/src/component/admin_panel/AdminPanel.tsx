import CurrentCompetitionCards from './CurrentCompetitionCards';
import StagingCompetitionCards from './StagingCompetitionCards';
import UpcomingCompetitionCards from './UpcomingCompetitionCards';

import React from 'react';
import { Yasss } from '../../modules/DanceEvent';

// test data
const Competition1: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Novice, Yasss.Round.Prelims);
const Competition2: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Intermediate, Yasss.Round.Prelims);
const Competition3: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.Advanced, Yasss.Round.Prelims);
const Competition4: Yasss.Competition =  new Yasss.Competition("Jack & Jill", Yasss.Division.AllStar, Yasss.Round.Prelims);

export const CurrentCompetitionsContext = React.createContext(new Array<Yasss.Competition>);
export const StagingCompetitionsContext = React.createContext(new Array<Yasss.Competition>);
export const UpcomingCompetitionsContext = React.createContext(new Array<Yasss.Competition>);

export default function AdminPanel(props: {competitions: Array<Yasss.Competition>}) {
    let currentCompetitions = [Competition1];
    let stagingCompetitions = [Competition2];
    let upcomingCompetitions = [Competition3, Competition4];

    return (
        <main>
            <CurrentCompetitionsContext.Provider value={currentCompetitions}>
            <StagingCompetitionsContext.Provider value={stagingCompetitions}>
            <UpcomingCompetitionsContext.Provider value={upcomingCompetitions}>

                <CurrentCompetitionCards/>
                <StagingCompetitionCards/>
                <UpcomingCompetitionCards/>

            </UpcomingCompetitionsContext.Provider>
            </StagingCompetitionsContext.Provider>
            </CurrentCompetitionsContext.Provider>
        </main>
    )
}