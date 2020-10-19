const redisFunctions = require('../redis')

const fetchAllRooms = async (req, res, next) => {
	try {
		const rooms = await redisFunctions.fetchAllRooms()
		return res.status(200).json({
			"message": 'success',
			"result": {
				"userId": userId,
				"rooms": rooms
			}
		})

	} catch (error) {
		return next(error)
	}
}

module.exports = fetchAllRooms