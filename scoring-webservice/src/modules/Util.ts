import { Yasss } from './DanceEvent';
 
export module Util {
    
    export function GetAwardedPoints(tier: Yasss.Tier, placement: number) : number {
            switch(tier) {
                case Yasss.Tier.Tier1:
                    case Yasss.Tier.Tier1:
                        if (placement == 1)
                            return 3;
                        else if (placement == 2)
                            return 2;
                        else if (placement == 3)
                            return 1;
                        else
                            return 0;
                    case Yasss.Tier.Tier2:
                        if (placement == 1)
                            return 6;
                        else if (placement == 2)
                            return 4;
                        else if (placement == 3)
                            return 3;
                        else if (placement == 4)
                            return 2;
                        else if (placement == 5)
                            return 1;
                        else
                            return 0;
                    case Yasss.Tier.Tier3:
                        if (placement == 1)
                            return 10;
                        else if (placement == 2)
                            return 8;
                        else if (placement == 3)
                            return 6;
                        else if (placement == 4)
                            return 4;
                        else if (placement == 5)
                            return 2;
                        else if (placement > 5 && placement <= 10)
                            return 1;
                        else
                            return 0;
                    case Yasss.Tier.Tier4:
                        if (placement == 1)
                            return 15;
                        else if (placement == 2)
                            return 12;
                        else if (placement == 3)
                            return 10;
                        else if (placement == 4)
                            return 8;
                        else if (placement == 5)
                            return 6;
                        else if (placement > 5 && placement <= 15)
                            return 1;
                        else
                            return 0;
                    case Yasss.Tier.Tier5:
                        if (placement == 1)
                            return 20;
                        else if (placement == 2)
                            return 16;
                        else if (placement == 3)
                            return 14;
                        else if (placement == 4)
                            return 12;
                        else if (placement == 5)
                            return 10;
                        else if (placement > 5 && placement <= 15)
                            return 2;
                        else
                            return 0;
                    case Yasss.Tier.Tier6:
                        if (placement == 1)
                            return 25;
                        else if (placement == 2)
                            return 22;
                        else if (placement == 3)
                            return 18;
                        else if (placement == 4)
                            return 15;
                        else if (placement == 5)
                            return 12;
                        else if (placement > 5 && placement <= 15)
                            return 2;
                        else
                            return 0;
                    default:
                    case Yasss.Tier.NoTier:
                        return 0;
            }
    }

    export function GetTier(numberOfCompetitors: number) : Yasss.Tier {
        if (numberOfCompetitors >= 5 && numberOfCompetitors <= 10)
            return Yasss.Tier.Tier1;
        else if (numberOfCompetitors >= 11 && numberOfCompetitors < 20)
            return Yasss.Tier.Tier2;
        else if (numberOfCompetitors >= 20 && numberOfCompetitors < 40)
            return Yasss.Tier.Tier3;
        else if (numberOfCompetitors >= 40 && numberOfCompetitors < 80)
            return Yasss.Tier.Tier4;
        else if (numberOfCompetitors >= 80 && numberOfCompetitors < 130)
            return Yasss.Tier.Tier5;
        else if (numberOfCompetitors >= 130)
            return Yasss.Tier.Tier6;
        else
            return Yasss.Tier.NoTier;;
    }
}