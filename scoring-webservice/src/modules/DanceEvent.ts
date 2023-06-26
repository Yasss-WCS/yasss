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

        constructor(firstName: string, lastName: string, bibNumber?: string) {
            super(firstName, lastName);

            if (bibNumber == undefined) {
                this.BibNumber = "";
            }
            else {
                this.BibNumber = bibNumber;
            }
        }
    }
    
    export class Judge extends Person {
        
    }

    export class DanceEvent {
        public Name: string;

        constructor() {
            this.Name = "";
        }
    }
    
    export class Competition {
        private _dateTime: Date;
        private _leaders: Array<Competitor>;
        private _followers: Array<Competitor>;
    
        public Name: string;

        constructor() {
            this._dateTime = new Date();
            this._leaders = new Array<Competitor>();
            this._followers = new Array<Competitor>();

            this.Name = "";
        }
    
        public AddLeader(competitor: Competitor) {
            this._leaders.push(competitor);
        }
    
        public AddFollower(competitor : Competitor) {
            this._followers.push(competitor);
        }
    }
}