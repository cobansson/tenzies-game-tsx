import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface BoxInt {
    selectDice(diceID: string): void;
    isHeld: boolean;
    id: string;
    image: IconDefinition;
}

export interface DiceInt {
    id: string;
    value: number;
    isHeld: boolean;
    image: IconDefinition;
}

export interface TimeInt {
    sec: number;
    min: number;
}