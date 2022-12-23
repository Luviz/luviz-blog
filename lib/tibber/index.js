import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const callTibberApi = async (accessToken, variables) => {
  const client = new ApolloClient({
    uri: "https://api.tibber.com/v1-beta/gql/",
    cache: new InMemoryCache(),
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await client.query({
    query: gql`
      query Nodes($resolution: EnergyResolution!, $last: Int) {
        viewer {
          name
          homes {
            consumption(resolution: $resolution, last: $last) {
              nodes {
                unitPrice
                consumption
                consumptionUnit
                cost
                currency
                to
                unitPriceVAT
              }
            }
          }
        }
      }
    `,
    variables,
  });

};
