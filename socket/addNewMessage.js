const {
	addMessage
} = require('../redis')

/**
 * 
 * @param {Object} messageParams 
 * @param {String} messageParams.text Message Text
 * @param {String} messageParams.senderId Message sender i.e. user ID
 * @param {String} messageParams.id Message ID
 * @param {String} messageParams.timestamp Message Sent Timestamp
 * @param {Object} socket Socket Object
 */
const addNewMessage = ({ text, chatRoomId, senderId, id, timestamp }, socket) => {
	try {
		await addMessage({ text, chatRoomId, senderId, id, timestamp })
		socket.to(chatRoomId).emit('newMessage', { text, chatRoomId, senderId, id, timestamp })
	} catch (error) {
		throw error
	}
}