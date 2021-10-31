export default (MongoDB, database) => [
	{
		query: "tree add",
		callback: async (data, webSocket) => {
			const objectDocument = await database.collection("trees").insertOne({ meta: data.meta })
			webSocket.send(JSON.stringify({ query: "tree added", data: { id: data.id, networkId: objectDocument.insertedId } }))
		}
	},
	{
		query: "tree update",
		callback: async data => {
			database.collection("trees").updateOne({"_id": MongoDB.ObjectID(data.networkId) }, { $set: { meta: data.form } })
		}
	},
	{
		query: "tree remove",
		callback: async data => {
			database.collection("trees").deleteOne({"_id": MongoDB.ObjectID(data.networkId) })
		}
	}
]
