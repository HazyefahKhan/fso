const Notification = ({ message, type = 'success' }) => {
    if (!message) {
      return null
    }

    const notificationStyle = {
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: type === 'error' ? 'red' : 'green'
    }
  
    return (
      <div className={type === 'error' ? 'error' : 'success'} style={notificationStyle}>
        {message}
      </div>
    )
  }
  
  export default Notification