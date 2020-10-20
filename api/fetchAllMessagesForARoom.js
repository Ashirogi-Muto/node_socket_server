const redisFunctions = require('../redis')

const fetchAllMessagesForARoom = async (req, res, next) => {
	try {
		const { roomId } = req.params
		const messages = await redisFunctions.fetchAllMessages(roomId)
		return res.status(200).json({
			message: 'success',
			result: {
				messages
			}
		})
	} catch (error) {
		return next(error)
	}
}

module.exports = fetchAllMessagesForARoom