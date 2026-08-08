[back](../../tableOfContent.md)


```graphql
input GetOperationsInputResolver {
  account_id: Int!
  limit: Int = 100
  offset: Int = 0
  category_ids: [Int!]
  third_ids: [Int!]
  dest_account_ids: [Int!]
  type_ids: [Int!]
  status_ids: [Int!]
  description: String
  text: String
  amount_min: Float
  amount_max: Float
  date_from: String
  date_to: String
}
```
