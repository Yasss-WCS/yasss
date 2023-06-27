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
    
        public Name: string;
        public Division: Division;

        constructor(name : string, division?: Division) {
            this._dateTime = new Date();
            this._leaders = new Array<Competitor>();
            this._followers = new Array<Competitor>();

            this.Name = name != null ? name : "";
            this.Division = division != null ? division : Division.Open;
        }
    
        public AddLeader(competitor: Competitor) {
            this._leaders.push(competitor);
        }
    
        public AddFollower(competitor : Competitor) {
            this._followers.push(competitor);
        }
    }
}