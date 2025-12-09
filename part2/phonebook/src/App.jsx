import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find(person => person.name === newName)
    
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNotification({ message: `Updated ${returnedPerson.name}`, type: 'success' })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification({ 
              message: `Information of ${newName} has already been removed from server`, 
              type: 'error' 
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
      return
    }
    
    const person = {
      name: newName,
      number: newNumber
    }

    
    personService
      .add(person)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
  }
  
  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber= (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`Failed to delete ${name}`)
        })
    }
  }

  const personsToShow = searchTerm
    ? persons.filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : persons
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNewPerson={handleNewPerson}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App