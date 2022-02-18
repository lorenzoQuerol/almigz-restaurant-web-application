import connectToContentful from "@utils/contentfulConnection";

const query = `{
	operatingHoursCollection {
		items {
			startTime
			endTime
		}
	}
}`;

async function handler(req, res) {
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const response = await connectToContentful(query);
				if (!response) res.status(404).json({ success: false, message: "Operating hours items not found" });

				const operatingHours = response.data.operatingHoursCollection.items[0];

				res.status(200).json({ success: true, operatingHours });
			} catch (err) {
				res.status(400).json({ success: false, message: "An error occurred" });
			}
			break;

		default:
			res.status(500).json({ success: false, message: "Route is not valid" });
			break;
	}
}

export default handler;
