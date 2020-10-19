const app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')
const bodyParser = require('body-parser')
const { APP_PORT } = require('./utils/constants')
const initializeSocketMethods = require('./socket')
const fetchUserRooms = require('./api/fetchUserRooms')
const addRoom = require('./api/addRoom')
const fetchAllRooms = require('./api/fetchAllRooms')

app.use(cors())
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/view/index.html')
})

app.get('/user-rooms/:userId', fetchUserRooms)
app.get('/all-rooms', fetchAllRooms)

app.post('/new-room', addRoom)

initializeSocketMethods(io)

/**
 * Express error handler
 * @param {Object} error - The Express error object.
 * @param {Object} req - The Express req object.
 * @param {Object} res - The Express res object.
 * @param {Object} next - The Express next object.
 */
app.use((error, req, res, next) => {
	console.error('Error in data socket server', error.message)
	const { message, status, errorStatusCode, errorCode, name } = error
	res.status(status || 500).send({
		message: message || error,
		errorCode: status || errorStatusCode || errorCode || 500,
		name: name ? name : 'Error'
	})
})

server.listen(APP_PORT, () => {
	console.log(`Socket server started on port ${APP_PORT}`);
})