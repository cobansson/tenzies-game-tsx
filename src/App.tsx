import Box from "./Box";
import { useState } from "react";
import { diceInt } from "./Interface";
import { nanoid } from "nanoid";

function App() {
  const arrayOfDices = (): diceInt[] => {
    const arr: diceInt[] = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        id: nanoid(),
        value: Math.floor(Math.random() * 6 + 1),
        isHeld: false,
      });
    }
    return arr;
  };

  const [dices, setDices] = useState<diceInt[]>(arrayOfDices());

  const rollDice = (): void => {
    setDices(arrayOfDices());
  };

  const selectDice = (diceID: string) => {
    setDices(prevDices => {
      return prevDices.map(prevDice => {
        return prevDice.id === diceID ? {
          ...prevDice,
          isHeld: !prevDice.isHeld
        } : prevDice
      })
    })
  };

  const randomNumBoxes = dices.map((dice) => (
    <Box
      key={dice.id}
      randomNumber={dice.value}
      selectDice={selectDice}
      isHeld={dice.isHeld}
      id={dice.id}
    />
  ));

  return (
    <main>
      <h1>Tenzies</h1>
      <p>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="random-number-boxes">{randomNumBoxes}</div>
      <button onClick={rollDice}>Roll</button>
    </main>
  );
}

export default App;
