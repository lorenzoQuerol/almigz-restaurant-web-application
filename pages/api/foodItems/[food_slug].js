import connectToContentful from "@utils/contentfulConnection";

function getQuery(food_slug) {
	const query = `{
            foodItemCollection(where: {slug: "${food_slug}"}) {
              items {
                productName
                category
                productDescription
                productPrice
                available
                productImagesCollection {
                  items {
                    title
                    description
                    contentType
                    fileName
                    size
                    url
                    width
                    height
                  }
                }
                slug
              }
            }
          }`;

	return query;
}

async function handler(req, res) {
	// Unpack the request
	const {
		method,
		query: { food_slug },
	} = req;

	switch (method) {
		// Get single food item (UNPROTECTED)
		case "GET":
			const query = getQuery(food_slug);

			try {
				const response = await connectToContentful(query);
				const foodItem = response.data.foodItemCollection.items[0];

				res.status(200).json({ success: true, data: foodItem });
			} catch (err) {
				res.status(400).json({ success: false, msg: `Error getting food item: ${err.message}` });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid." });
			break;
	}
}

export default handler;
