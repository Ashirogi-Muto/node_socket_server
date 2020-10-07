const onDisconnect = require('./disconnect')
const newRoomSetup = require('./newRoom')
const {
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
		socket.on('disconnect', onDisconnect(socket))
	})
}
module.exports = initializeSocketMethods