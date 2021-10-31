export default (MongoDB, database) => [
	{
		query: "individual add",
		callback: async (data, webSocket) => {
			data.tree = MongoDB.ObjectID(data.tree)
			const objectDocument = await database.collection("individuals").insertOne(data)
			webSocket.send(JSON.stringify({ query: "individual added", data: { id: data.id, networkId: objectDocument.insertedId, tree: data.tree } }))
		}
	},
	{
		query: "individual update",
		callback: async data => {
			database.collection("individuals").updateOne({"_id": MongoDB.ObjectID(data.networkId) }, { $set: { meta: data.form } })
		}
	},
	{
		query: "individual remove",
		callback: async data => {
			database.collection("individuals").deleteOne({"_id": MongoDB.ObjectID(data.networkId) })
		}
	},
	{
		query: "tree remove",
		callback: async data => {
			database.collection("individuals").deleteMany({"tree": MongoDB.ObjectID(data.networkId) })
		}
	}
]
