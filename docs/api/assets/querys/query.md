[back](../../tableOfContent.md)


```graphql
type Query {
  testBdd: TestModelResolver!
  hello: HelloModelResolver!
  accounts: [AccountModelResolver!]!
  account(dto: GetAccountInputResolver!): AccountModelResolver!
  accountTypes: [AccountTypeModelResolver!]!
  operations(dto: GetOperationsInputResolver!): [OperationModelResolver!]!
  operation(dto: GetOperationInputResolver!): OperationModelResolver!
  operationTypes: [OperationTypeModelResolver!]!
  operationCategories: [OperationCategoryModelResolver!]!
  operationStatus: [OperationStatutModelResolver!]!
  operationThirds: [OperationThirdModelResolver!]!
  operationLinks(dto: GetOperationInputResolver!): [OperationLinkModelResolver!]!
  auth(dto: AuthInput!): AuthModelResolver!
}
```
