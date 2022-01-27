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
	const {
		method,
		query: { food_slug },
	} = req;

	switch (method) {
		case "GET":
			// Place food_slug filter into query
			const query = getQuery(food_slug);

			try {
				const response = await connectToContentful(query);
				if (!response) res.status(404).json({ success: false, message: "Food item not found" });

				const foodItem = response.data.foodItemCollection.items[0];
				res.status(200).json({ success: true, message: "Successful query", foodItem });
			} catch (err) {
				res.status(400).json({ success: false, message: `An error occurred` });
			}
			break;

		default:
			res.status(500).json({ success: false, message: "Route is not valid" });
			break;
	}
}

export default handler;
