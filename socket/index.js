const onDisconnect = require('./disconnect')
const newRoomSetup = require('./newRoom')
const addNewMessage = require('./addNewMessage')

const {
	fetchAllMessages,
	fetchAllRooms,
	fetchUserRooms
} = require('../redis')

const initializeSocketMethods = io => {
	io.on('connection', socket => {
		console.log('a new connection detected', io.sockets.adapter.rooms)
		socket.on('newRoom', async data => {
			try {
				await newRoomSetup(data, socket)
			} catch (error) {
				socket.emit('newRoomCreationError', data)
			}
		})
		socket.on('fetchAllRooms', async userId => {
			try {

				const rooms = await fetchAllRooms()
				socket.emit('receiveAllRooms', { rooms, userId })
			} catch (error) {
				socket.emit('fetchAllRoomsError', data)
			}
		})

		socket.on('fetchUserRooms', async userId => {
			try {
				const userRooms = await fetchUserRooms(userId)
				socket.emit('receiveUserRooms', { userRooms, userId })
			} catch (error) {
				socket.emit('fetchUserRoomsError', { userId })
			}
		})

		socket.on('sendNewMessage', async data => {
			try {
				addNewMessage(data)
				socket.emit('receiveNewMessage', data)
			} catch (error) {
				console.log(error);
				socket.emit('sendNewMessageError', data)
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