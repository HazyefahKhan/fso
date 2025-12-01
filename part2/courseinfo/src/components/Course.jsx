const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part =>
    <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = ({parts}) => {
  const initialValue = 0;
  const sum = parts.reduce(
    (accumulator, currentPart) => accumulator + currentPart.exercises,
    initialValue,
  )

  return(
    <p>
      <strong>total of {sum} exercises</strong>
    </p>
  )
}

const Course = ({course}) => {
  return(
  <div>
    <Header course={course.name}/>
    <Content parts={course.parts}/>
    <Total parts={course.parts}/>
  </div>
)
}
export default Course