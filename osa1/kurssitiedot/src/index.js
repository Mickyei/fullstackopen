import React from 'react'
import ReactDOM from 'react-dom'


const Header = (props) => {
  return (
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(chapter => <Part name={chapter.name} exercises={chapter.exercises} key={chapter.name}/>)}
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.name}. {props.exercises} exercises.
      </p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
        Number of total exercises: {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises }
      </p>
    </div>
  )
}


const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))