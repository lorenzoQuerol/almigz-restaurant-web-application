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
          branchesAvailable
          slug
          }
        }
      }`;

async function handler(req, res) {
	const {
		method,
		query: { branch },
	} = req;

	switch (method) {
		case "GET":
			try {
				const response = await connectToContentful(query);
				if (!response) res.status(404).json({ success: false, message: "Food items not found" });

				let foodItems;
				let data = response.data.foodItemCollection.items;

				if (branch)
					foodItems = data.filter((foodItem) => {
						if (foodItem.branchesAvailable !== null) return foodItem.branchesAvailable.includes(branch);
					});
				else foodItems = data;

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
