import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Resources/react-trello-master/src'

const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins'},
        {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
      ]
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '0/0',
      cards: []
    }
  ]
}

var onclickof = () => {
  
}
function App() {



  return (
    <div className="App">
     
     <Board
      draggable
      canAddLanes
      editable
      onCardAdd={() => console.log('card added')}
      data={data} />
    </div>
  );
}

export default App;
