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

export interface ScoreInt {
    rolled: number;
    time: string;
}

export interface ScoreDataInt {
    nickname: string;
    rolled: number;
    time: string;
}

export interface ScoreListInt {
    id: string;
    nickname: string;
    rolled: number;
    time: string;
}