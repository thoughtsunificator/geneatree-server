export default (MongoDB, database) => [
	{
		query: "individualNotesAdd",
		callback: async (data, webSocket) => {
			data.individual = MongoDB.ObjectID(data.individual)
			const objectDocument = await database.collection("notes").insertOne({ individual: data.individual, title: data.title, content: data.content, author: data.author, date: data.date })
			webSocket.send(JSON.stringify({ query: "individualNotesAdded", data: { id: data.id, networkId: objectDocument.insertedId, individual: data.individual } }))
		}
	},
	{
		query: "individualNotesUpdate",
		callback: async data => {
			database.collection("notes").updateOne({"_id": MongoDB.ObjectID(data.networkId) }, { $set: data.form })
		}
	},
	{
		query: "individualNotesRemove",
		callback: async data => {
			database.collection("notes").deleteOne({"_id": MongoDB.ObjectID(data.networkId) })
		}
	},
	{
		query: "individualRemove",
		callback: async data => {
			database.collection("notes").deleteOne({"individual": MongoDB.ObjectID(data.networkId) })
		}
	}
]
