const redisFunctions = require('../redis')

const leaveRoom = async (req, res, next) => {
	try {
		const { roomId } = req.params
		const { userEmail } = req.query

		if(!roomId) {
			throw new Error('No room ID provided!')
		}

		if(!userEmail) {
			throw new Error('No user email provided!')
		}

		await redisFunctions.removeRoomIdFromUseRoomList(userEmail, roomId)
		return res.status(200).json({
			message: 'success'
		})
		
	} catch (error) {
		return next(error)
	}
}

module.exports = leaveRoom