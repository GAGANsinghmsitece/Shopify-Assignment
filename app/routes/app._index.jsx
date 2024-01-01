import { useEffect, useRef, useState } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, Form, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Spinner
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import styles from "../styles/shared.css";
import ProductListingCard from "../shared/components/ProductListingCard/ProductListingCard";
export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
      `#graphql
      query {
        products(first: 100,reverse:true) {
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
  const navigation = useNavigation();
  const formRef = useRef(null);

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
      formRef.current?.reset();
    }
  }, [actionData]);

  return (
    <Page>
      <ui-title-bar title="Shop2App Assignment">
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap={500}>
                <BlockStack gap={200}>
                  <div className="CreateProductFormContainer">
                    <Text className="CreateProductFormTitle" as="h2" variant="headingMd">
                      Create a Product
                    </Text>
                  </div>
                </BlockStack>
                <BlockStack gap={200}>
                  <div className="CreateProductFormContainer">
                    <Form method="post" ref={formRef}>
                      <BlockStack gap={200}>
                        <input
                          className="CreateProductInput"
                          type="text"
                          name="productName"
                          placeholder="Enter Product Name"
                        />
                        <input
                          className="CreateProductInput"
                          type="text"
                          name="price"
                          placeholder="Price of Product"
                        />
                        {
                          (navigation.state === 'loading' || navigation.state === "submitting") && navigation?.formData?.get("productName") ?
                            <button
                              disabled={true}
                              className="CreateProductButton"
                              type="submit">
                              <Spinner size="small" />
                            </button> :
                            <button
                              className="CreateProductButton"
                              type="submit">
                              Create Product
                            </button>
                        }
                      </BlockStack>
                    </Form>
                  </div>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <ProductListingCard products={products} />
        </Layout>
      </BlockStack>
    </Page>
  );
}

export const links = () => [
  { rel: "stylesheet", href: styles }
]
