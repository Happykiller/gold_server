[back](../../tableOfContent.md)


```graphql
type OperationModelResolver {
  id: Int!
  account_id: Int!
  account_id_dest: Int
  amount: Float!
  date: String!
  status_id: Int!
  type_id: Int!
  third_id: Int
  category_id: Int
  vat_rate: Float!
  description: String!
  active: Boolean!
  creator_id: Int!
  creation_date: String!
  modificator_id: Int
  modification_date: String
  account: AccountModelResolver!
  account_dest: AccountModelResolver
  status: OperationStatutModelResolver!
  type: OperationTypeModelResolver!
  third: OperationThirdModelResolver!
  category: OperationCategoryModelResolver!
}
```
