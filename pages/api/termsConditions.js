import connectToContentful from "@utils/contentfulConnection";

const query = `{
	termsConditionsCollection {
		items {
			sectionNumber
			sectionTitle
			sectionContent {
				json
			}
		}
	}
}
`;

async function handler(req, res) {
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const response = await connectToContentful(query);
				if (!response) res.status(404).json({ success: false, message: "Items not found" });

				const termsConditionsItems = response.data.termsConditionsCollection.items;

				res.status(200).json({ success: true, message: "Successful query", termsConditionsItems });
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
