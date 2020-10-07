const moment = require('moment-timezone')
const {
	TIMEZONE
} = require('./constants')

const getLocalTimestamp = () => moment().tz(TIMEZONE)

const getFormattedLocalTimestamp = () => getLocalTimestamp().format('YYYY-MM-DD HH:mm:ss')

module.exports = {
	getFormattedLocalTimestamp
}