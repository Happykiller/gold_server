[back](../../tableOfContent.md)


```graphql
type AccountModelResolver {
  id: Int!

  """1, regular by default"""
  type_id: Int!
  parent_account_id: Int
  label: String!
  description: String
  balance_reconcilied: Float
  balance_not_reconcilied: Float
  creator_id: Int!
  creation_date: String!
  modificator_id: Int
  modification_date: String
}
```
