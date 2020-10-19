const onDisconnect = require('./disconnect')
const addNewMessage = require('./addNewMessage')

const initializeSocketMethods = io => {
	io.on('connection', socket => {
		// console.log('a new connection detected', io.sockets.adapter.rooms)
		console.log('a new connection detected')

		socket.on('sendNewMessage', async data => {
			try {
				addNewMessage(data)
				socket.emit('receiveNewMessage', data)
			} catch (error) {
				console.log(error);
				socket.emit('sendNewMessageError', data)
			}
		})
		socket.on('disconnect', onDisconnect(socket))
	})
}
module.exports = initializeSocketMethods