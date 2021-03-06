import React, { useState, useEffect } from 'react';
import { createStore } from 'redux';
import logo from './logo.svg';
import './App.css';
import Board from './Resources/react-trello-master/src'
import PouchDB from 'pouchdb-browser'
var db = new PouchDB('zoomrx');
var _ = require('lodash')
const initialData = {
  _id: 'personal',
  lanes: []
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

  var onCardMoved = async (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
    try {
      let doc = await db.get('personal')
      if (doc) {
        let localData = doc
        let lanes = doc.lanes
        // remove the card from the source lane
        lanes.forEach((lane) => {
          if (lane.id === sourceLaneId) {
            let tempCardArray = lane.cards.filter((card) => card.id !== cardId)
            console.log(tempCardArray)
            lane.cards = tempCardArray
          }
        })
        // add the card to target
        lanes.forEach((lane) => {
          if (lane.id === targetLaneId) {
            lane.cards.push(cardDetails)
          }
        })
        //final
        localData.lanes = lanes
        
        let localObject = Object.assign({}, localData, {_rev: doc._rev})
        setData(localObject)
        
        let response = await db.put(localObject)
      }

    } catch (error) {
      console.log(error)
    }
  }

  var onCardDelete = async (cardid, laneid) => {
    try {
      let doc = await db.get('personal')
      if (doc) {
        let localData = doc
        let lanes = doc.lanes
        lanes.forEach((lane) => {
          if (lane.id === laneid) {
            let newCardArray = lane.cards.filter((card) => card.id !== cardid)
            lane.cards = newCardArray
          }
        })
        localData.lanes = lanes
        
        let localObject = Object.assign({}, localData, {_rev: doc._rev})

         setData(localObject)
        
        let response = await db.put(localObject)
        console.log(response)
       
      }

    } catch(error) {
      console.error(error)
    }
  }
  var removeLane = async (laneid) => {
    try {
      let doc = await db.get('personal')
      if (doc) {
        let localData = doc
        let lanes = doc.lanes
        var newLanes = lanes.filter((lane) => lane.id !== laneid)
        localData.lanes = newLanes
        let localObject = Object.assign({}, localData, {_rev: doc._rev})
        setData(localObject)
        let response = await db.put(localObject)

      }
    }
    catch (error) {

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
      onCardDelete={onCardDelete}
      handleDragEnd={onCardMoved}
      removeLane={removeLane}
      data={data} />
    </div>
  );
}

export default App;
