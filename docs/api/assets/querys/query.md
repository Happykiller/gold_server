[back](../../tableOfContent.md)


```graphql
type Query {
  testBdd: TestModelResolver!
  hello: HelloModelResolver!
  accounts: [AccountModelResolver!]!
  account(dto: GetAccountInputResolver!): AccountModelResolver!
  accountTypes: [AccountTypeModelResolver!]!
  operations(dto: GetAccountInputResolver!): [OperationModelResolver!]!
  operation(dto: GetOperationInputResolver!): OperationModelResolver!
  operationTypes: [OperationTypeModelResolver!]!
  operationCategories: [OperationCategoryModelResolver!]!
  operationStatus: [OperationStatutModelResolver!]!
  operationThirds: [OperationThirdsModelResolver!]!
  operationLinks(dto: GetOperationInputResolver!): [OperationLinkModelResolver!]!
  auth(dto: AuthInput!): AuthType!
}
```
