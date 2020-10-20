const {
	addMessage,
	addMessageIdToRoomMessageList
} = require('../redis')

const {
	getFormattedLocalTimestamp
} = require('../utils/momentHelper')

/**
 * 
 * @param {Object} messageParams 
 * @param {String} messageParams.text Message Text
 * @param {String} messageParams.senderId Message sender i.e. user ID
 * @param {String} messageParams.id Message ID
 * @param {String} messageParams.timestamp Message Sent Timestamp
 * @returns {Object} newMessageData
 * @throws Error
 */
const addNewMessage = async ({ text, chatRoomId, senderId, id }) => {
	try {
		const newMessageData = { text, chatRoomId, senderId, id, timestamp: getFormattedLocalTimestamp() }
		await addMessage(newMessageData)
		await addMessageIdToRoomMessageList(chatRoomId, id)
		return newMessageData
	} catch (error) {
		throw error
	}
}

module.exports = addNewMessage