export default (MongoDB, database) => [
	{
		query: "individualAdd",
		callback: async (data, webSocket) => {
			data.tree = MongoDB.ObjectID(data.tree)
			const objectDocument = await database.collection("individuals").insertOne(data)
			webSocket.send(JSON.stringify({ query: "individualAdded", data: { id: data.id, networkId: objectDocument.insertedId, tree: data.tree } }))
		}
	},
	{
		query: "individualUpdate",
		callback: async data => {
			database.collection("individuals").updateOne({"_id": MongoDB.ObjectID(data.networkId) }, { $set: { meta: data.form } })
		}
	},
	{
		query: "individualRemove",
		callback: async data => {
			database.collection("individuals").deleteOne({"_id": MongoDB.ObjectID(data.networkId) })
		}
	},
	{
		query: "treeRemove",
		callback: async data => {
			database.collection("individuals").deleteMany({"tree": MongoDB.ObjectID(data.networkId) })
		}
	}
]
