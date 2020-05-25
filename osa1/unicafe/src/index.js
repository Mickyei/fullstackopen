import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>{props.text}</button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
    
      <tr><td>{props.text}</td><td>{props.value}</td></tr>
   
  )
}

const Statistics = (props) => {
  if(props.feedback === true) {
    return (
      <div>
        <table>
          <tbody>
          <StatisticLine text="good" value ={props.values[0]} />
        <StatisticLine text="neutral" value ={props.values[1]} />
        <StatisticLine text="bad" value ={props.values[2]} />
        <StatisticLine text="all" value={props.values[3]} />
        <StatisticLine text="average" value={props.values[4]} />
        <StatisticLine text="positive" value={props.values[5] + '%'} />
          </tbody>
        </table>
       
      </div>
    )
  } else {
    return <h1>no feedback given yet</h1>
  }
  
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [feedback, setFeedback] = useState(false);
  const all = good + neutral + bad;
  const average = (good - bad) / (good + neutral + bad);
  const positive = good / (good + neutral + bad);

  const values = [good, neutral, bad, all, average, positive];


  const incrementGood = () => {
    setGood(good + 1);
    if(feedback === false) {
      setFeedback(true);
    }
  }

  const incrementNeutral = () => {
    setNeutral(neutral + 1);
    if(feedback === false) {
      setFeedback(true);
    }
  }

  const incrementBad = () => {
    setBad(bad + 1);
    if(feedback === false) {
      setFeedback(true);
    }
  }

  return (
    <div>
      <h1>give feedback</h1>


    <Button handleClick = {incrementGood} text={'good'}/>
    <Button handleClick = {incrementNeutral} text={'neutral'}/>
    <Button handleClick = {incrementBad} text={'bad'}/>
  

    <h1>statistics</h1>
    <Statistics values={values} feedback={feedback}/>
   
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
