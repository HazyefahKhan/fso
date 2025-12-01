import { useState } from 'react'

const Header = ({ title }) => <h1>{title}</h1>
const Button = ({ onClick, text}) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)
const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad

  if (good === 0 && neutral === 0 && bad === 0){
    return(
      <div>No feedback given</div>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine text="average" value={(good  + (-1 * bad)) / (good + neutral + bad)} />
        <StatisticLine text="positive" value={`${(good / (good + neutral + bad) * 100) || 0} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleBadClick = () => setBad (bad + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)

  return (
    <div>
      <Header title="give feedback"/>
      <Button onClick={handleGoodClick} text="good"/>
      <Button onClick={ handleNeutralClick} text="neutral"/>
      <Button onClick={handleBadClick} text="bad"/>
      <Header title="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
      

    </div>
  )
}

export default App