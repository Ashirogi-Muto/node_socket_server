const redisFunctions = require('../redis')

const fetchUserRooms = async (req, res, next) => {
	try {
		const { userId } = req.params
		if(!userId) {
			throw new Error('Missing user id in request param')
		}
		const userRooms = await redisFunctions.fetchUserRooms(userId)
		return res.status(200).json({
			"message": 'success',
			"result": {
				"userId": userId,
				"rooms": userRooms
			}
		})

	} catch (error) {
		return next(error)
	}
}

module.exports = fetchUserRooms