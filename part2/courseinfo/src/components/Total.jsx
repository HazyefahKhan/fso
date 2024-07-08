const Total = ({ parts }) => {
    const initalValue = 0
    const total = (parts.reduce((total, part) => total + part.exercises, initalValue))
    return (
        <p><b>total of {total} exercises</b></p>
    )
}

export default Total