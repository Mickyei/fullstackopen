import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './App.css'



const Notification = (props) => {
  if (props.message === null) {
    return null
  }

  return (
    <div style={props.style} >
      {props.message}
    </div>
  )
}



const Filter = (props) => {

  return (
    <div>
      filter: <input onChange={props.handleFilter} />
    </div>
  )
}

const Person = (props) => {

  return (
    <div>
      <form>
        <div>
          name: <input onChange={props.handleName} />
        </div>
        <div>number: <input onChange={props.handleNumber} /></div>
        <button type="submit" onClick={props.addNote} >add</button>

      </form>

    </div>
  )
}

const ListItem = (props) => {

  const deleteNote = () => {
    if (window.confirm(`Are you sure you want to delete ${props.person.name}?`)) {

      personService
        .remove(props.person.id)
        .then(response => {
          console.log(response)
          props.updater();
          props.deleter(`${props.person.name} deleted successfully`,false);
        })
        .catch(error => {
          props.deleter(`${props.person.name} was already deleted from the server`,true);
        })
    }
  }

  return (

    <li key={props.person.name}>
      {props.person.name} {props.person.number} <button onClick={deleteNote} >Delete</button>
    </li>

  )
}

const PersonsList = (props) => {

  return (
    <div>

      <h2>Numbers</h2>
      {props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase())).map((person) =>
        <ListItem person={person} key={person.id} updater={props.updater} deleter={props.deleter}/>
      )}
    </div>

  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [msgClr, setMsgClr] = useState('green')

  const notiStyle = {
    color: msgClr,
    background: 'lightgreen',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };



  const hook = () => {
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault();

    //Check if name input is empty
    if (newName.trim()) {

      const newPerson = {
        name: newName, number: newNumber
      }

      if (persons.some(e => e.name === newName)) {

        if (window.confirm(`${newName} is already added to phonebook, do you want to update number?`)) {

          const personUpdated = persons.find(n => n.name === newName)
          console.log(personUpdated);
          personService
            .update(personUpdated.id, newPerson)
            .then(response => {
              console.log(response)
              hook();
              setErrorMessage(
                `Person '${personUpdated.name}' updated`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
        }

      } else {

        personService
          .create(newPerson)
          .then(response => {
            console.log(response)
            hook();

            setErrorMessage(
              `Person '${newPerson.name}' added`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }

    } else {
      window.alert('Please fill the name')
    }
  }

  const deleteAlert = (message, isError) => {
    if(isError) {
      console.log("Haloo")
      setMsgClr('red')
      console.log(msgClr);
    }
    setErrorMessage(
      `${message}`
    )
    setTimeout(() => {
      setErrorMessage(null)
      setMsgClr('green')
    }, 5000)
  }

  const handleName = (event) => {
    setNewName(event.target.value);
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilter = (event) => {
    setFilter(event.target.value);

  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification message={errorMessage} style={notiStyle} />
      <Filter handleFilter={handleFilter} />
      <Person handleName={handleName} handleNumber={handleNumber} addNote={addNote} />
      <PersonsList persons={persons} filter={filter} updater={hook} deleter={deleteAlert} />
    </div>
  )

}

export default App
