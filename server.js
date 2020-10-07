const app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const { APP_PORT } = require('./utils/constants')
const initializeSocketMethods = require('./socket')

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/view/index.html')
})

initializeSocketMethods(io)

server.listen(APP_PORT, () => {
	console.log(`Socket server started on port ${APP_PORT}`);
})