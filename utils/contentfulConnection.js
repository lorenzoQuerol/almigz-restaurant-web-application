// GraphQL query
const query = `{
  foodItemCollection {
    items {
      productName
      productDescription
      productPrice
      available
      slug
    }
  }
}`;

export default async function fetchFoodItems() {
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
        return response.data.foodItemCollection;
    } catch (error) {
        throw new Error("Could not fetch data from Contentful!");
    }
}
