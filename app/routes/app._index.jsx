import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, Form, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  TextField,
  Toast,
  Spinner
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import ProductList from "../shared/components/ProductList/ProductList";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
      query {
        products(first: 10, reverse: true) {
          edges {
            node {
              id
              title
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }`,
    );
    const responseJson = await response.json();
    return json({
      products: responseJson?.data?.products?.edges
    });
  } catch (err) {
    console.log("Encountering error while fetching product", err);
    return json({
      error: err.message
    });
  }
};

export const action = async ({ request }) => {
  try {

    //parsing request Body
    const formData = await request.formData();
    const productName = formData.get("productName");
    const price = formData.get("price");

    //validating parameters
    if (!productName || !price) {
      throw new Error(
        "Product Name and Price are required in order to create a product"
      );
    }
    const parsedPrice = parseInt(price);
    if (isNaN(price) || isNaN(price)) {
      throw new Error(
        "Price can only include number"
      );
    }

    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
      {
        variables: {
          input: {
            title: productName,
            variants: [{ price: price }],
          },
        },
      }
    );
    const responseJson = await response.json();
    console.log(responseJson);
    return json({
      product: responseJson.data.productCreate.product,
    });
  } catch (err) {
    console.log("Error while creating product", err);
    return json({
      error: err.message
    });
  }
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const fetchedProductsResponse = useLoaderData();
  const [products, setProduct] = useState(null);

  useEffect(() => {
    if (fetchedProductsResponse?.error) {
      shopify.toast.show(fetchedProductsResponse.error);
    } else if (fetchedProductsResponse?.products) {
      setProduct(fetchedProductsResponse.products);
    }
  }, [fetchedProductsResponse]);


  useEffect(() => {
    if (actionData?.error) {
      shopify.toast.show(actionData.error);
    } else if (actionData?.product) {
      shopify.toast.show("Product created successfully!!!");
    }
  }, [actionData]);
  console.log("Shop2App", products, fetchedProductsResponse);
  return (
    <Page>
      <ui-title-bar title="Shop2App Assignment">
        {/* <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button> */}
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap={500}>
                <BlockStack gap={200}>
                  <Text as="h2" variant="headingMd">
                    Create a Product
                  </Text>
                </BlockStack>
                <BlockStack gap={200}>
                  <Form method="post">
                    <input type="text" name="productName" placeholder="Enter Product Name" />
                    <input type="text" name="price" placeholder="Price of Product" />
                    <Button variant="primary" type="submit">Create Product</Button>
                  </Form>
                </BlockStack>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap={500}>
                <BlockStack gap={200}>
                  <Text as="h2" variant="headingMd">
                    Existing Products
                  </Text>
                </BlockStack>
                <BlockStack gap={200}>
                  {products === null ? <>
                    <Spinner accessibilityLabel="Spinner example" size="large" />
                    <Text as="p">
                      Fetching Products
                    </Text>
                  </> : <ProductList products={products} />}
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          {/* <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section> */}
        </Layout>
      </BlockStack>
    </Page>
  );
}
