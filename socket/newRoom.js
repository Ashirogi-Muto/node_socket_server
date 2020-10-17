const uuid = require('uuid').v4
const {
	ROOM_PREFIX
} = require('../utils/constants')

const {
	addRoom,
	addRoomKeyInRoomList,
	addUserToUserRoomList
} = require('../redis')

const {
	getFormattedLocalTimestamp
} = require('../utils/momentHelper')

/**
 * 
 * @param {Object} newRoomParams
 * @param {String} newRoomParams.name Room Name
 * @param {String} newRoomParams.tag Room Tag
 * @param {String} newRoomParams.userId Room Created By User ID
 * @param {*} socket Socket Object
 */
const setupNewRoom = async ({ name, tag, userId, roomId }, socket) => {
	try {
		if(!name || !tag || !userId || !roomId) {
			throw Error('Missing required params')
		}
		const key = `${ROOM_PREFIX}${roomId}`
		const newRoom = {
			key,
			name, tag, createdBy: userId,
			createdAt: getFormattedLocalTimestamp()
		}

		const isNewRoomCreated = await addRoom(newRoom)

		if (isNewRoomCreated) {
			const isRoomAddedInList = await addRoomKeyInRoomList(key)
			if (isRoomAddedInList) {
				await addUserToUserRoomList(userId, key)
				socket.join(key, () => {
					socket.to(key).emit('newRoomCreated', roomId)
				})
			}
		}
	} catch (error) {
		throw error
	}
}

module.exports = setupNewRoom