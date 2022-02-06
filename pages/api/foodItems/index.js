import connectToContentful from "@utils/contentfulConnection";

const query = `{
      foodItemCollection {
        items {
          productName
          category
          productDescription
          productPrice
          productPrices
          available
          sizes
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

async function handler(req, res) {
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const response = await connectToContentful(query);
				if (!response) res.status(404).json({ success: false, message: "Food items not found" });

				const foodItems = response.data.foodItemCollection.items;

				res.status(200).json({ success: true, message: "Successful query", foodItems });
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
