import { useState } from 'react'

const FeedbackHeader = () => <h1>give feedback</h1>
const FeedbackButton = (props) => <button onClick={props.onClick}>{props.text}</button>
const StatisticHeader = () => <h1>Statistics</h1>
const StatisticLine = (props) => <tr><td>{props.feedback}</td><td>{props.value}</td></tr>
const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <p>No feedback given</p>
    )
  }


  return (
    <table>
      <tbody>
        <StatisticLine feedback="good" value={props.good} />
        <StatisticLine feedback="neutral" value={props.neutral} />
        <StatisticLine feedback="bad" value={props.bad} />
        <StatisticLine feedback="all" value={props.all} />
        <StatisticLine feedback="average" value={props.average} />
        <StatisticLine feedback="positive" value={props.positive + "%"} />
      </tbody>
    </table>
  )    
}
  
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    let updatedGood = good + 1
    let updatedAll = all + 1
    setGood(updatedGood)
    setAll(updatedAll)
    setAverage(((updatedGood) + (bad * -1)) / (updatedAll))
    setPositive(((updatedGood) / (updatedAll)) * 100) 
  }

  const handleBadClick = () => {
    let updatedBad = bad + 1
    let updatedAll = all + 1
    setBad(updatedBad)
    setAll(updatedAll)
    setAverage((good + ((updatedBad) * -1)) / (updatedAll))
    setPositive(((good) / (updatedAll)) * 100) 
  }

  const handleNeutralClick = () => {
    let updatedNeutral = neutral + 1
    let updatedAll = all + 1
    setNeutral(updatedNeutral)
    setAll(updatedAll)
    setAverage((good + (bad * -1)) / (updatedAll))
    setPositive(((good) / (updatedAll)) * 100) 
  }

  return (
    <div>
      <FeedbackHeader />
      <FeedbackButton onClick={handleGoodClick} text="good" />
      <FeedbackButton onClick={handleNeutralClick} text="neutral" />
      <FeedbackButton onClick={handleBadClick} text="bad" />
      <StatisticHeader/>
      <Statistics good={good} bad={bad} neutral={neutral} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App
