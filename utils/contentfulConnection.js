export async function getFoodItem(slug) {
    const query = `{
      foodItemCollection(where: {slug: "${slug}"}) {
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

    try {
        const response = await connectToContentful(query);
        const foodItem = response.data.foodItemCollection.items[0];

        return foodItem;
    } catch (err) {
        console.error(`[${new Date().toISOString()}] ${err}`);
    }
}

export async function getAllFoodItems() {
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

    try {
        const response = await connectToContentful(query);
        const foodItems = response.data.foodItemCollection.items;

        return foodItems;
    } catch (err) {
        console.error(`[${new Date().toISOString()}] ${err}`);
    }
}

export async function connectToContentful(query) {
    // Create a GraphQL query
    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
    const fetchOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    };

    try {
        const response = await fetch(fetchUrl, fetchOptions).then((response) => response.json());
        return response;
    } catch (error) {
        throw new Error("Could not fetch data from Contentful.");
    }
}
