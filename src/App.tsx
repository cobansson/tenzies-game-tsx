import Box from "./Box";
import { useEffect, useState } from "react";
import { DiceInt, TimeInt } from "./Interface";
import { nanoid } from "nanoid";
import ReactConfetti from "react-confetti";
import { diceImagesArray } from "./Images";

function App() {
  const arrayOfDices = (): DiceInt[] => {
    const arr: DiceInt[] = [];
    for (let i = 0; i < 10; i++) {
      const diceValue: number = Math.floor(Math.random() * 6 + 1);
      arr.push({
        id: nanoid(),
        value: diceValue,
        isHeld: false,
        image: diceImagesArray[diceValue - 1],
      });
    }
    return arr;
  };

  const [dices, setDices] = useState<DiceInt[]>(arrayOfDices());
  const [tenzies, setTenzies] = useState<boolean>(false);
  const [numberClicked, setNumberClicked] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<number>(0);
  const [time, setTime] = useState<TimeInt>({
    sec: 0,
    min: 0,
  });

  useEffect(() => {
    const isValueMatching: boolean = dices.every(
      (val) => val.isHeld === dices[0].isHeld && val.value === dices[0].value
    );
    setTenzies(isValueMatching);
    isValueMatching && clearInterval(intervalId);
  }, [dices, intervalId]);

  useEffect(() => {
    const intervalId = setInterval(updateTimer, 1000);
    setIntervalId(intervalId);
    return () => clearInterval(intervalId);
  }, []);

  const rollDice = (): void => {
    setDices((prevDices) => {
      return prevDices.map((prevDice) => {
        return !prevDice.isHeld
          ? {
              ...prevDice,
              value: Math.floor(Math.random() * 6 + 1),
            }
          : prevDice;
      });
    });

    setDices((prevDices) =>
      prevDices.map((prevDice) => ({
        ...prevDice,
        image: diceImagesArray[prevDice.value - 1],
      }))
    );
    setNumberClicked((prevNumberClicked) => prevNumberClicked + 1);
  };

  const restartTimer = (): void => {
    const newIntervalId = setInterval(updateTimer, 1000);
    setIntervalId(newIntervalId);
  };

  const updateTimer = (): void => {
    setTime((prevTime) => {
      if (prevTime.sec < 59) {
        return {
          ...prevTime,
          sec: prevTime.sec + 1,
        };
      } else {
        return {
          min: prevTime.min + 1,
          sec: 0,
        };
      }
    });
  };

  const selectDice = (diceID: string) => {
    !tenzies &&
      setDices((prevDices) => {
        return prevDices.map((prevDice) => {
          return prevDice.id === diceID
            ? {
                ...prevDice,
                isHeld: !prevDice.isHeld,
              }
            : prevDice;
        });
      });
  };

  const randomNumBoxes = dices.map((dice) => (
    <Box
      key={dice.id}
      selectDice={selectDice}
      isHeld={dice.isHeld}
      id={dice.id}
      image={dice.image}
    />
  ));

  const showTime =
    time.sec < 10 ? (
      <h2>
        0{time.min} : 0{time.sec}
      </h2>
    ) : (
      <h2>
        0{time.min} : {time.sec}
      </h2>
    );

  return (
    <body>
      {!tenzies ? (
        <main>
          <div>
            <h1>Tenzies</h1>
            <p>
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
            <div className="random-number-boxes">{randomNumBoxes}</div>
            <h2>Times rolled: {numberClicked}</h2>
            <h2>Took to win: {showTime}</h2>
            <button onClick={rollDice}>Roll</button>
          </div>
        </main>
      ) : (
        <div>
          <ReactConfetti />
          <main>
            <h1>Congratulations</h1>
            <div className="random-number-boxes">{randomNumBoxes}</div>
            <h2>Times rolled: {numberClicked}</h2>
            <h2>Took to win: {showTime}</h2>
            <button
              onClick={() => {
                setDices(arrayOfDices);
                setNumberClicked(0);
                setTime({
                  min: 0,
                  sec: 0,
                });
                restartTimer();
              }}
            >
              NEW GAME
            </button>
          </main>
        </div>
      )}
    </body>
  );
}

export default App;
