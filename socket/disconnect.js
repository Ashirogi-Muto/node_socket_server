const onDisconnect = socket => () => {
	console.log('a connection disconnected', socket.id);
}

module.exports = onDisconnect