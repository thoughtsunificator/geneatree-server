export default (MongoDB, database) => [
	{
		query: "treeAdd",
		callback: async (data, webSocket) => {
			const objectDocument = await database.collection("trees").insertOne({ meta: data.meta })
			webSocket.send(JSON.stringify({ query: "treeAdded", data: { id: data.id, networkId: objectDocument.insertedId } }))
		}
	},
	{
		query: "treeUpdate",
		callback: async data => {
			database.collection("trees").updateOne({"_id": MongoDB.ObjectID(data.networkId) }, { $set: { meta: data.form } })
		}
	},
	{
		query: "treeRemove",
		callback: async data => {
			database.collection("trees").deleteOne({"_id": MongoDB.ObjectID(data.networkId) })
		}
	}
]
