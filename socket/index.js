const onDisconnect = require('./disconnect')
const newRoomSetup = require('./newRoom')
const addNewMessage = require('./addNewMessage')

const {
	fetchAllMessages,
	fetchAllRooms
} = require('../redis')

const initializeSocketMethods = io => {
	io.on('connection', socket => {
		console.log('a new connection detected', io.sockets.adapter.rooms)
		socket.on('newRoom', async data => {
			await newRoomSetup(data, socket)
		})
		socket.on('seeAllRooms', async () => {
			try {
				const rooms = await fetchAllRooms()
				console.log(rooms);
			} catch (error) {
				socket.emit('newRoomCreationError', data)
			}
		})

		socket.on('sendNewMessage', async data => {
			try {
				console.log(data);
				addNewMessage(data)
				socket.emit('receiveNewMessage', data)
			} catch (error) {
				console.log(error);
				socket.to(chatRoomId).emit('sendNewMessageError', data)
			}
		})

		socket.on('fetchAllMessages', async data => {
			console.log('DETECTED fetchAllMessages');
			try {
				const { chatRoomId } = data
				const messages = await fetchAllMessages(chatRoomId)
				socket.emit('receiveNewMessage', messages)
			} catch (error) {
				console.log(error);
			}
		})

		socket.on('disconnect', onDisconnect(socket))
	})
}
module.exports = initializeSocketMethods