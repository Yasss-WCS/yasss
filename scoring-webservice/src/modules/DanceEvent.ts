import { Guid } from './Guid';
import { Util } from './Util';

export module Yasss {
    export enum Division {
        Newcomer = "Newcomer",
        Novice = "Novice",
        Intermediate = "Intermediate",
        Advanced = "Advanced",
        AllStar = "All Star",
        Champion = "Champion",
        Open = "Open",
        Sophisticated = "Sophsticated",
        Masters = "Masters",
    }

    export enum Round {
        Prelims = "Prelims",
        Quarters = "Quarterfinals",
        Semis = "Semifinals",
        Finals = "Finals"
    }

    export enum CallbackScore {
        Yes = "Yes",
        No = "No",
        Alternate1 = "Alt1",
        Alternate2 = "Alt2",
        Alternate3 = "Alt3",
        Unscored = ""
    }

    export enum Tier {
        Tier1,
        Tier2,
        Tier3,
        Tier4,
        Tier5,
        Tier6,
        NoTier
    }
    
    export interface IPerson {
        GetFullName(): string;
    }

    export abstract class Person implements IPerson {
        private _firstName: string;
        private _lastName: string;
    
        constructor(firstName: string, lastName: string) {
            this._firstName = firstName;
            this._lastName = lastName;
        }
    
        GetFullName(): string {
            return this._firstName + " " + this._lastName;
        }
    
        public SetName(firstName: string, lastName: string) {
            this._firstName = firstName;
            this._lastName = lastName;
        }
    }

    export class Competitor extends Person {
        private _id: Guid;
        public BibNumber: string;
        public IsCheckedIn: boolean;
        public Scores: Array<Score>;

        constructor(firstName: string, lastName: string, bibNumber?: string) {
            super(firstName, lastName);

            this._id = Guid.MakeNew();
            this.IsCheckedIn = false;

            this.Scores = new Array<Score>;
            
            this.BibNumber = bibNumber != null ? bibNumber : "";
        }
    }
    
    export class Judge extends Person {
        
    }

    export class DanceEvent {
        public Name: string;

        constructor(name: string) {
            this.Name = name != null ? name : "";
        }
    }
    
    export class Competition {
        private _dateTime: Date;
        private _leaders: Array<Competitor>;
        private _followers: Array<Competitor>;
        private _leaderTier: Tier; 
        private _followerTier: Tier; 

        public Name: string;
        public Division: Division;
        public Round: Round;

        constructor(name : string, division?: Division, round?: Round) {
            this._leaderTier = Tier.NoTier;
            this._followerTier = Tier.NoTier;

            this._dateTime = new Date();
            this._leaders = new Array<Competitor>();
            this._followers = new Array<Competitor>();

            this.Name = name != null ? name : "";
            this.Division = division != null ? division : Division.Open;
            this.Round = round != null ? round : Round.Finals;
        }
    
        public get LeaderTier(){
            return Util.GetTier(this._leaders.length);            
        }

        public get FollowerTier(){
            return Util.GetTier(this._followers.length);            
        }

        public AddLeader(competitor: Competitor) {
            this._leaders.push(competitor);
        }
    
        public AddFollower(competitor : Competitor) {
            this._followers.push(competitor);
        }

        public GetLeaderCount() : number {
            return this._leaders.length;
        }
        
        public GetFollowerCount() : number {
            return this._followers.length;
        }
    }

    export interface IScore {
        Competitor: Competitor | null | undefined;
        Judge: Judge | null | undefined;
        Round: Round;
    }

    export abstract class Score implements IScore {
        public Competitor: Competitor | null | undefined;
        public Judge: Judge | null | undefined;
        public Round: Round;

        constructor(competitor? : Competitor, judge? : Judge, round? : Round){

            this.Competitor = competitor;
            this.Judge = judge;
            this.Round = round != null ? round : Round.Prelims;
        }
    }

    export class PrelimScore extends Score {
        
        constructor(competitor? : Competitor, judge? : Judge, round? : Round) {
            super(competitor, judge, round);
        }
    }

    export class FinalScore extends Score {
        constructor(competitor? : Competitor, judge? : Judge) {
            super(competitor, judge, Round.Finals);
        }
    }
}