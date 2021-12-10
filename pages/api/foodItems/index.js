import connectToContentful from "@utils/contentfulConnection";

const query = `{
      foodItemCollection {
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

async function handler(req, res) {
    const { method } = req;

    switch (method) {
        // Get all food items
        case "GET":
            try {
                const response = await connectToContentful(query);
                if (!response)
                    res.status(404).json({ success: false, msg: "Cannot find food items." });

                const foodItems = response.data.foodItemCollection.items;

                res.status(200).json({ success: true, data: foodItems });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        default:
            res.status(500).json({ success: false, msg: "Route is not valid." });
            break;
    }
}

export default handler;
