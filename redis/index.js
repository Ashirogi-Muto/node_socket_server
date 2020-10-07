const { promisify } = require("util");
const redis = require('redis')
const redisClient = redis.createClient()
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient)
const hmsetAsync = promisify(redisClient.HMSET).bind(redisClient)
const saddAsync = promisify(redisClient.SADD).bind(redisClient)
const lpushAsync = promisify(redisClient.LPUSH).bind(redisClient)
const lrangeAsync = promisify(redisClient.LRANGE).bind(redisClient)
const smembersAsync = promisify(redisClient.SMEMBERS).bind(redisClient)

const {
	MESSAGE_PREFIX,
	ROOM_LIST_KEY,
	USER_ROOMS_PREFIX,
} = require('../utils/constants')

/**
 * 
 * @param {Object} messageParams
 * @param {String} messageParams.text
 * @param {String} messageParams.chatRoomId
 * @param {String} messageParams.senderId
 * @param {String} messageParams.id
 * @param {String} messageParams.timestamp
 */
const addMessage = async ({ text, chatRoomId, senderId, id, timestamp }) => {
	try {
		const messageData = [
			'text', text,
			'chatRoomId', chatRoomId,
			'senderId', senderId,
			'id', id, 
			'timestamp', timestamp
		]
		const key = `${MESSAGE_PREFIX}${chatRoomId}`
		return await hmsetAsync(key , messageData)
	} catch (error) {
		throw error
	}
}

/**
 * 
 * @param {Object} addRoomParams
 * @param {String} addRoomParams.key Room Key
 * @param {String} addRoomParams.name Room Name
 * @param {String} addRoomParams.tag Room Tag
 * @param {String} addRoomParams.createdBy Room Created By User Id
 * @param {String} addRoomParams.createdAt Room Created At Timestamp
 * @returns {Promise} Bool isNewRoomAdded
 */
const addRoom = async ({ key, name, tag, createdBy, createdAt }) => {
	try {
		const roomData = [
			'name', name,
			'tag', tag,
			'createdAt', createdAt,
			'createdBy', createdBy,
			'id', key
		]
		return await hmsetAsync(key, roomData)
	} catch (error) {
		throw error
	}
}

/**
 * 
 * @param {String} key Room Key
 * @returns {Promise} Boolean isRoomKeyAddedInRoomList
 */
const addRoomKeyInRoomList = async key => {
	try {
		return await lpushAsync(ROOM_LIST_KEY, key)
	} catch (error) {
		throw error
	}
}

/**
 * 
 * @param {String} userId User ID
 * @param {String} roomKey Room Key
 * @returns {Boolean} isUserAddedToUserRoomList
 */
const addUserToUserRoomList = async (userId, roomKey) => {
	try {
		return await lpushAsync(`${USER_ROOMS_PREFIX}${userId}`, roomKey)
	} catch (error) {
		throw error
	}
}

/**
 * 
 * @param {String} id User Id
 * @returns {Object} user
 */
const fetchUser = async id => {
	try {
		const user = await hgetallAsync(`${USER_PREFIX}${id}`)
	} catch (error) {
		throw error
	}
	
}

/**
 * @returns {Array} rooms
 */
const fetchAllRooms = async () => {
	try {
		const rooms = await lrangeAsync(ROOM_LIST_KEY, 0, -1)
		if(rooms.length > 0) {
			const getRoomDetailsPromise = rooms.map(room => {
				return hgetallAsync(room)
			})
			const allRoomsWithDetails = await Promise.all(getRoomDetailsPromise)
			return allRoomsWithDetails
		}
		return []
	} catch (error) {
		throw error
	}
}


module.exports = {
	addMessage,
	addRoom,
	addRoomKeyInRoomList,
	addUserToUserRoomList,
	fetchAllRooms,
	fetchUser
}