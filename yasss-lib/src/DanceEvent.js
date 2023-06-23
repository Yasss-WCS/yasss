"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yasss = void 0;
var Yasss;
(function (Yasss) {
    var Division;
    (function (Division) {
        Division[Division["Newcomer"] = 0] = "Newcomer";
        Division[Division["Novice"] = 1] = "Novice";
        Division[Division["Intermediate"] = 2] = "Intermediate";
        Division[Division["Advanced"] = 3] = "Advanced";
        Division[Division["AllStar"] = 4] = "AllStar";
        Division[Division["Champion"] = 5] = "Champion";
        Division[Division["Open"] = 6] = "Open";
        Division[Division["Sophisticated"] = 7] = "Sophisticated";
        Division[Division["Masters"] = 8] = "Masters";
    })(Division = Yasss.Division || (Yasss.Division = {}));
    var Person = /** @class */ (function () {
        function Person(firstName, lastName) {
            this._firstName = firstName;
            this._lastName = lastName;
        }
        Person.prototype.GetFullName = function () {
            return this._firstName + " " + this._lastName;
        };
        Person.prototype.SetName = function (firstName, lastName) {
            this._firstName = firstName;
            this._lastName = lastName;
        };
        return Person;
    }());
    Yasss.Person = Person;
    var Competitor = /** @class */ (function (_super) {
        __extends(Competitor, _super);
        function Competitor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Competitor;
    }(Person));
    Yasss.Competitor = Competitor;
    var Judge = /** @class */ (function (_super) {
        __extends(Judge, _super);
        function Judge() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Judge;
    }(Person));
    Yasss.Judge = Judge;
    var DanceEvent = /** @class */ (function () {
        function DanceEvent() {
        }
        return DanceEvent;
    }());
    Yasss.DanceEvent = DanceEvent;
    var Competition = /** @class */ (function () {
        function Competition() {
            this._leaders = new Array();
            this._followers = new Array();
        }
        Competition.prototype.AddLeader = function (competitor) {
            this._leaders.push(competitor);
        };
        Competition.prototype.AddFollower = function (competitor) {
            this._followers.push(competitor);
        };
        return Competition;
    }());
    Yasss.Competition = Competition;
})(Yasss || (exports.Yasss = Yasss = {}));
