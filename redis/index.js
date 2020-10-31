const { promisify } = require("util");
const redis = require('redis')
const redisClient = redis.createClient()
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient)
const hmsetAsync = promisify(redisClient.HMSET).bind(redisClient)
const saddAsync = promisify(redisClient.SADD).bind(redisClient)
const lpushAsync = promisify(redisClient.LPUSH).bind(redisClient)
const lrangeAsync = promisify(redisClient.LRANGE).bind(redisClient)
const smembersAsync = promisify(redisClient.SMEMBERS).bind(redisClient)
const lremAsync = promisify(redisClient.LREM).bind(redisClient)


const {
	MESSAGE_PREFIX,
	ROOM_LIST_KEY,
	ROOM_PREFIX,
	USER_ROOMS_PREFIX
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
		const key = `${MESSAGE_PREFIX}${id}`
		return await hmsetAsync(key , messageData)
	} catch (error) {
		throw error
	}
}

const addMessageIdToRoomMessageList = async (roomId, messageId) => {
	try {
		const key = `${MESSAGE_PREFIX}${roomId}`
		console.log('addMessageIdToRoomMessageList KEY', key);
		await lpushAsync(key, messageId)
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
 * @param {String} roomId 
 * @returns {Array} allMessages
 * @throws Error
 */
const fetchAllMessages = async roomId => {
	try {
		if(!roomId) {
			throw new Error('Input room id is missing')
		}
		const roomMessageListkey = `${MESSAGE_PREFIX}${roomId}`
		const roomMessageIds = await lrangeAsync(roomMessageListkey, 0, -1)

		if(roomMessageIds.length > 0) {
			const fetchMessagesPromise = roomMessageIds.map(id => {
				const messageKey = `${MESSAGE_PREFIX}${id}`
				return hgetallAsync(messageKey)
			})
			return await Promise.all(fetchMessagesPromise)
		}
		return []
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
			return await returnAllRoomsFromRoomList(rooms)
		}
		return []
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
 * 
 * @param {String} id 
 */
const fetchUserRooms = async id => {
	try {
		if(!id) {
			throw new Error('Missing required input user id')
		}
		const key = `${USER_ROOMS_PREFIX}${id}`
		const roomIdList = await lrangeAsync(key, 0, -1)

		if(roomIdList.length > 0) {
			return await returnAllRoomsFromRoomList(roomIdList)
		}
		return []
	} catch (error) {
		throw error
	}
}

/**
 * 
 * @param {Array} roomList 
 * @returns {Promise} roomArray
 */
const returnAllRoomsFromRoomList = async roomList => {
	try {
		const getRoomDetailsPromise = roomList.map(room => {
			return hgetallAsync(room)
		})
		const allRoomsWithDetails = await Promise.all(getRoomDetailsPromise)
		return allRoomsWithDetails
	} catch (error) {
		
	}
}

/**
 * 
 * @param {String} userId 
 * @param {String} roomId 
 */
const removeRoomIdFromUseRoomList = async (userId, roomId) => {
	try {
		const key = `${USER_ROOMS_PREFIX}${userId}`
		await lremAsync(key, 0, roomId)
	} catch (error) {
		throw error
	}
}


module.exports = {
	addMessage,
	addMessageIdToRoomMessageList,
	addRoom,
	addRoomKeyInRoomList,
	addUserToUserRoomList,
	fetchAllMessages,
	fetchAllRooms,
	fetchUser,
	fetchUserRooms,
	removeRoomIdFromUseRoomList
}