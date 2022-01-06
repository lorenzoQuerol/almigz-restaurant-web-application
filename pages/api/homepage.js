import connectToContentful from "@utils/contentfulConnection";

const query = `
    {
      homepageAnnouncementCollection {
        items {
          label
          announcementsCollection {
            items {
              url
              width
              height
            }
          }
        }
      }
    }
`;

async function handler(req, res) {
	const { method } = req;

	switch (method) {
		// Get all home page items
		case "GET":
			try {
				const response = await connectToContentful(query);
				if (!response) res.status(404).json({ success: false, msg: "Cannot find homepage items." });

				const homepageItems = response.data.homepageAnnouncementCollection.items;

				res.status(200).json({ success: true, data: homepageItems });
			} catch (err) {
				console.log(err);
				res.status(400).json({ success: false, msg: err });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid." });
			break;
	}
}

export default handler;
