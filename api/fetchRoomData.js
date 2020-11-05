const redisFunctions = require('../redis')

const fetchRoomData = async (req, res, next) => {
	try {
		const { roomId } = req.params
		const roomDetails = await redisFunctions.fetchRoomDetails(roomId)
		return res.status(200).json({
			message: 'success',
			result: roomDetails
		})
	} catch (error) {
		return next(error)
	}
}

module.exports = fetchRoomData