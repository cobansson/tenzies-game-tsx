import Box from "./Box";
import { useEffect, useState } from "react";
import { DiceInt, TimeInt, ScoreListInt, ScoreDataInt } from "./Interface";
import { nanoid } from "nanoid";
import ReactConfetti from "react-confetti";
import { diceImagesArray } from "./Images";
import { addDoc, onSnapshot } from "firebase/firestore";
import { dicesCollection } from "./firebase";

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
  const [scoresIsShown, setScoresIsShown] = useState<boolean>(false);
  const [numberClicked, setNumberClicked] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<number | NodeJS.Timeout>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [time, setTime] = useState<TimeInt>({
    sec: 0,
    min: 0,
  });
  const [username, setUsername] = useState<string>("");
  const [scoreData, setScoreData] = useState<ScoreDataInt>({
    nickname: "",
    rolled: 0,
    time: "",
  });
  const [scoresArr, setScoresArr] = useState<ScoreListInt[]>([
    {
      id: "",
      nickname: "",
      rolled: 0,
      time: "",
    },
  ]);

  const showTime =
    time.sec < 10
      ? `0${time.min} : 0${time.sec}`
      : `0${time.min} : ${time.sec}`;

  const scoreBoard = scoresArr.map((scoreArr) => (
    <li key={scoreArr.id} className="score-item">
      <span className="nickname">{scoreArr.nickname}</span>
      <span className="rolled">{scoreArr.rolled}</span>
      <span className="time">{scoreArr.time}</span>
    </li>
  ));

  useEffect(() => {
    const unsub = onSnapshot(dicesCollection, (snapshot) => {
      const scoresData: ScoreListInt[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nickname: data.nickname,
          rolled: data.rolled,
          time: data.time,
        };
      });
      setScoresArr(
        scoresData.sort((b, a) => {
          return b.rolled - a.rolled;
        })
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    setScoreData({
      nickname: username,
      rolled: numberClicked,
      time: showTime,
    });
  }, [username, numberClicked, showTime]);

  useEffect(() => {
    const isValueMatching: boolean = dices.every(
      (val) => val.isHeld === dices[0].isHeld && val.value === dices[0].value
    );
    setTenzies(isValueMatching);
    isValueMatching && clearInterval(intervalId);
  }, [dices, intervalId]);

  useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(updateTimer, 1000);
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

  const setNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsername(value);
  };

  const sendScore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newScoreData = scoreData;
      setIsSubmitted(prevIsSubmitted => !prevIsSubmitted);
      await addDoc(dicesCollection, newScoreData);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const showScore = () => {
    setScoresIsShown((prevScoresIsShown) => !prevScoresIsShown);
  };

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
            {!scoresIsShown ? (
              <div className="score-section">
                <h3>Send your score</h3>
                <form onSubmit={sendScore} className="form">
                  <input
                    type="text"
                    onChange={setNickname}
                    placeholder="your nickname"
                    className="input-nickname"
                    required
                    maxLength={10}
                  />
                  <button 
                    className="send-score-btn"
                    disabled={isSubmitted}>SEND SCORE</button>
                </form>
              </div>
            ) : ( scoresArr.length > 0 ? (
              <div className="score-section">
              <h3>Scoreboard</h3>
              <ul>{scoreBoard}</ul>
            </div>
            ) : (
              <div className="score-section-empty">
                <h3>Nothing to show here</h3>
              </div>
            )
            )}
            <div className="btns-container">
              <button className="show-scores-btn" onClick={showScore}>
                {scoresIsShown ? "HIDE SCORES" : "SHOW SCORES"}
              </button>
              <button
              className="new-game-btn"
                onClick={() => {
                  setDices(arrayOfDices);
                  setNumberClicked(0);
                  setTime({
                    min: 0,
                    sec: 0,
                  });
                  restartTimer();
                  setScoresIsShown(false);
                  setIsSubmitted(false);
                }}
              >
                NEW GAME
              </button>
            </div>
          </main>
        </div>
      )}
    </body>
  );
}

export default App;
