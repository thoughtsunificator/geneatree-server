export default (MongoDB, database) => [
	{
		query: "individual notes add",
		callback: async (data, webSocket) => {
			data.individual = MongoDB.ObjectID(data.individual)
			const objectDocument = await database.collection("notes").insertOne({ individual: data.individual, title: data.title, content: data.content, author: data.author, date: data.date })
			webSocket.send(JSON.stringify({ query: "individual notes added", data: { id: data.id, networkId: objectDocument.insertedId, individual: data.individual } }))
		}
	},
	{
		query: "individual notes update",
		callback: async data => {
			database.collection("notes").updateOne({"_id": MongoDB.ObjectID(data.networkId) }, { $set: data.form })
		}
	},
	{
		query: "individual notes remove",
		callback: async data => {
			database.collection("notes").deleteOne({"_id": MongoDB.ObjectID(data.networkId) })
		}
	},
	{
		query: "individual remove",
		callback: async data => {
			database.collection("notes").deleteOne({"individual": MongoDB.ObjectID(data.networkId) })
		}
	}
]
