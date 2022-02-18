import connectToContentful from "@utils/contentfulConnection";

const query = `
    {
        deliveryFeeCollection {
            items {
                delFee
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
				if (!response) res.status(404).json({ success: false, message: "Delivery fee not found" });

				const deliveryFeeData = response.data.deliveryFeeCollection.items[0];

				res.status(200).json({ success: true, deliveryFeeData });
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
