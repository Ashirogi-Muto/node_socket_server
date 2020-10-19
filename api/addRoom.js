const redisFunctions = require('../redis')
const {
	getFormattedLocalTimestamp
} = require('../utils/momentHelper')

const {
	ROOM_PREFIX
} = require('../utils/constants')

const addRoom = async (req, res, next) => {
	try {
		const { name, tag, userId, roomId } = req.body
		if(!name || !tag || !userId || !roomId) {
			throw Error('Missing required input')
		}

		const key = `${ROOM_PREFIX}${roomId}`
		const newRoom = {
			key,
			name, tag, createdBy: userId,
			createdAt: getFormattedLocalTimestamp()
		}

		const isNewRoomCreated = await redisFunctions.addRoom(newRoom)

		if (isNewRoomCreated) {
			const isRoomAddedInList = await redisFunctions.addRoomKeyInRoomList(key)
			if (isRoomAddedInList) {
				await redisFunctions.addUserToUserRoomList(userId, key)
			}
		}

		return res.status(200).json({
			"message": 'success'
		})

	} catch (error) {
		console.log(error.message);
		return next(error)
	}
}

module.exports = addRoom