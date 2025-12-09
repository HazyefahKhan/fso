import axios from 'axios'
const baseUrl = `http://localhost:3001/persons`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response =>response.data)
}

const add = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const update = (id, newPerson) =>{
    const request = axios.put(`${baseUrl}/${id}`, newPerson)
    return request.then(response => response.data)
  }

const deletePerson = id => {
    console.log(`service id ${id}`)
    return axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, add, deletePerson, update}