// css
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// data
import { wordsList } from './data/words';


// components

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPicketCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    // pegando uma categoria aleatoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

   

    //pegando uma letra aleatoria

    const word = words[category][Math.floor(Math.random() * words[category].length)]



    return {word, category}
  }, [words]);

  // iniciando game
  const startGame = useCallback(() => {
    // apagar todfas as letras
    clearLetterStates();


    // pick word and pick category
    const {word, category} = pickWordAndCategory();


    // criando um array de letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // setando estados
    setPickedWord(word);
    setPicketCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // processando o input da letra [2]

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    // checar se a letra foi utilizada
    if (
    guessedLetters.includes(normalizedLetter) || 
    wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    
    // push letra ou remove as chances
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // se as tentativas terminarem vai para o end game
  useEffect(() => {
    if(guesses <= 0) {
      // reset todos os states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // verificar condição de vitória
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    // condição de vitoria 

      if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
        setScore((actualScore) => actualScore += 100) 
          // inicar novo game
          startGame();
      }
  }, [guessedLetters, letters, startGame])

  // reinciar jogo 

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

 

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      wordLetters={wrongLetters}
      score={score}
      guesses={guesses}
      />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
