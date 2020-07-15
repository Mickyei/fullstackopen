import React from 'react'

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
  
    const parts = props.parts.map(part => part.exercises);
  
    const total = parts.reduce((s,p) => s + p)
  
    return (
      <div>
        <p>
          Number of total exercises: {total}
        </p>
      </div>
    )
  }
  
  const Course = (props) => {
    const course = props.course
    return (
      <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
    )
  }

  export default Course;