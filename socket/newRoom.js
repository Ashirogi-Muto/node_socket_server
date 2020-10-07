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
const setupNewRoom = async ({ name, tag, userId }, socket) => {
	try {
		const key = `${ROOM_PREFIX}${uuid()}`
		const newRoom = {
			key,
			name, tag, createdBy: userId,
			createdAt: getFormattedLocalTimestamp()
		}

		const isNewRoomCreated = await addRoom(newRoom)

		if(isNewRoomCreated) {
			const isRoomAddedInList = await addRoomKeyInRoomList(key)
			if(isRoomAddedInList) {
				await addUserToUserRoomList(userId, key)
				socket.join(key)
			}
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = setupNewRoom