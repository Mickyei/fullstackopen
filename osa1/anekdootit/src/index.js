import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(props.anecdotes.length).fill(0))
  const [highest, setHighest] = useState(0)
  

  const getRandom = () => setSelected(Math.floor((Math.random() * props.anecdotes.length)))

  const voteAnecdote = () => {
    const copy = [...points];
    copy[selected]++;
    checkHighest(copy);
    setPoints(copy);
    
  }

  const checkHighest = (points) => {
    let maxIndex = highest;
    let max = points[highest];

    for (let i = 0; i < points.length; i++) {
        if (points[i] > max) {
            maxIndex = i;
            max = points[i];
        }
    }
    setHighest(maxIndex);
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{props.anecdotes[selected]}</p>
      <p>Has {points[selected]} votes</p>
      <button onClick={voteAnecdote} >vote for this anecdote</button>
      <button onClick={getRandom}>next anecdote</button>
      <h2>Anecdote with the most votes</h2>
      <p>{props.anecdotes[highest]}</p>
      <p>Has {points[highest]} votes</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]



ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)