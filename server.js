import fs from "fs"

import WS from "ws"
import MongoDB from "mongodb"

import config from "@thoughtsunificator/config-env"

(async function() {

	const _client = await MongoDB.MongoClient.connect(config.DATABASE_URL, { useUnifiedTopology: true })
	const _database = _client.db(config.DATABASE_NAME)

	const _listeners = []

	const files = fs.readdirSync("./socket/")

	for(const file of files) {
		_listeners.push(...(await import(`./socket/${file}`)).default(MongoDB, _database))
	}

	const _websocketServer = new WS.Server({ port: config.PORT })

	console.log(`WebSocket Server listening on ${config.PORT}`)

	_websocketServer.on('connection', async webSocket => {

		console.log(`Connection established`)

		webSocket.on('message', message => {
			const { query, data } = JSON.parse(message)

			console.log(`Received query: ${query}`, data)

			const listeners = _listeners.filter(socketListener => socketListener.query === query)

			if(listeners.length >= 1) {
				listeners.forEach(listener => listener.callback(data, webSocket))
			} else {
				console.log(`Unknown query: ${query}`)
			}
		})

		const trees = await _database.collection("trees").find().toArray()
		const individuals = await _database.collection("individuals").find().toArray()
		const notes = await _database.collection("notes").find().toArray()

		webSocket.send(JSON.stringify({ query: "load", data: { trees, individuals, notes } }))

	})

})()
