export interface BoxInt {
    randomNumber: number;
    selectDice(diceID: string): void;
    isHeld: boolean;
    id: string;
}

export interface diceInt {
    id: string;
    value: number;
    isHeld: boolean;
}