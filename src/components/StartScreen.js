import React from 'react'
import "./StartScreen.css";

const StartScreen = ({ startGame }) => {
  return (
    <div className='start'>
        <h2>Secret</h2>
        <h1>Word</h1>
        <p>Clique para começar</p>
        <button onClick={startGame}>Play</button>
    </div>
  )
}

export default StartScreen