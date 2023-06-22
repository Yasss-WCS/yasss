export module Yasss {
    export enum Division {
        Newcomer,
        Novice,
        Intermediate,
        Advanced,
        AllStar,
        Champion,
        Open,
        Sophisticated,
        Masters,
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
        public BibNumber: string;
    }
    
    export class Judge extends Person {
        
    }

    export class DanceEvent {
        private _name: string;
    }
    
    export class Competition {
        private _name: string;
        private _dateTime: Date;
    
        private _leaders: Array<Competitor>;
        private _followers: Array<Competitor>;
    
        constructor(){
            this._leaders = new Array<Competitor>();
            this._followers = new Array<Competitor>();
        }
    
        public AddLeader(competitor: Competitor) {
            this._leaders.push(competitor);
        }
    
        public AddFollower(competitor : Competitor) {
            this._followers.push(competitor);
        }
    }
}