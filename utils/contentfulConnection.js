// GraphQL query
const GRAPHQL_QUERY = `
{
      foodItemCollection {
        items {
          productName
          productDescription
          productPrice
          available
          slug
        } 
      }
}
`;

async function fetchGraphQL(preview = false) {
  // Create a GraphQL query
  try {
    const data = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ GRAPHQL_QUERY }),
    });

    response.status(200).json({ success: true, data: data });
  } catch (err) {
    response.status(400).json({ success: false, msg: err });
  }
}
