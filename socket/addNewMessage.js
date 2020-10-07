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
 * @throws Error
 */
const addNewMessage = async ({ text, chatRoomId, senderId, id }) => {
	try {
		await addMessage({ text, chatRoomId, senderId, id, timestamp: getFormattedLocalTimestamp() })
		await addMessageIdToRoomMessageList(chatRoomId, id)
	} catch (error) {
		throw error
	}
}

module.exports = addNewMessage