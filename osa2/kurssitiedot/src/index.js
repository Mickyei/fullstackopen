import React from 'react'
import ReactDOM from 'react-dom'
import Course from '../src/Course'

 
const App = () => {

  const course = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          id: 1,
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          id: 2,
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          id: 3,
          name: 'State of a component',
          exercises: 14
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          id: 1,
          name: 'Routing',
          exercises: 8
        },
        {
          id: 2,
          name: 'Middlewares',
          exercises: 15
        }
      ]
    }
  ]
  


  return (
    <div>
      {course.map(course => <Course key={course.id} course={course}/>)}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))