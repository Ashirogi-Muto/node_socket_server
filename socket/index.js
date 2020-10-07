const onDisconnect = require('./disconnect')
const newRoomSetup = require('./newRoom')
const addNewMessage = require('./addNewMessage')

const {
	fetchAllMessages,
	fetchAllRooms
} = require('../redis')

const initializeSocketMethods = io => {
	io.on('connection', socket => {
		console.log('a new connection detected')
		socket.on('newRoom', data => {
			newRoomSetup(data, socket)
		})
		socket.on('seeAllRooms',  async () => {
			try {
				const rooms = await fetchAllRooms()
				console.log(rooms);
			} catch (error) {
				console.log(error);
			}
		})

		socket.on('sendNewMessage', async data => {
			try {
				console.log(data);
				addNewMessage(data)
				const { chatRoomId } = data
				// socket.to(chatRoomId).emit('receiveNewMessage', data)
			} catch (error) {
				console.log(error);
				socket.to(chatRoomId).emit('sendNewMessageError', data)
			}
		})

		socket.on('fetchAllMessages', async data => {
			try {
				const { chatRoomId } = data
				const messages = await fetchAllMessages(chatRoomId)
				console.log('Messages__>', messages);
			} catch (error) {
				console.log(error);
			}
		})

		socket.on('disconnect', onDisconnect(socket))
	})
}
module.exports = initializeSocketMethods