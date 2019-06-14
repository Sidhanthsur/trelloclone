import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Resources/react-trello-master/src'
import PouchDB from 'pouchdb-browser'
var db = new PouchDB('zoomrx');
const initialData = {
  _id: 'personal',
  lanes: []
}




var onclickof = () => {
  
}

function App() {

  const [data, setData] = useState(initialData)
  var initializeDb = () => {
    db.put(initialData)
    .then((data) => console.log(data))
    .catch((error) => console.log(error))
  }
  
  db.get('personal')
  .then((doc) => {
    setData(doc)
  })
  .catch((error) => {
    initializeDb()
  })
  var onLaneAdded = async (params) => {
    let localData = data
    localData.lanes.push({id: params.title, title: params.title, cards: []})
    setData(localData)
    try {
      let doc = await db.get('personal')
      if (doc) {
        let localObject = Object.assign({}, localData, {_rev: doc._rev})
        let response = await db.put(localObject)
        console.log(response)
      }
    }
    catch (error) {
      console.error(error)
    }

  }

  var onCardAdded = async (card, laneId) => {
    try {
      let doc = await db.get('personal')
      if (doc) {
        let localData = doc
        localData.lanes.forEach((lane, key) => {
          console.log(lane) 
          if (lane.id === laneId) {
            lane.cards.push(card)
          }
        })
        let localObject = Object.assign({}, localData, {_rev: doc._rev})
        let response = await db.put(localObject)
        console.log(response)
        
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="App">
     
     <Board
      draggable
      canAddLanes
      editable
      onLaneAdd={onLaneAdded}
      onCardAdd={onCardAdded}
      data={data} />
    </div>
  );
}

export default App;
