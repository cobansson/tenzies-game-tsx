export interface BoxInt {
    randomNumber: number;
    selectDice(diceID: string): void;
    isHeld: boolean;
    id: string;
}

export interface DiceInt {
    id: string;
    value: number;
    isHeld: boolean;
}

export interface TimeInt {
    sec: number;
    min: number;
}