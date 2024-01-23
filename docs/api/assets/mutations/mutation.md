[back](../../tableOfContent.md)


```graphql
type Mutation {
  createAccount(dto: CreateAccountInputResolver!): AccountModelResolver!
  updateAccount(dto: UpdateAccountInputResolver!): AccountModelResolver!
  deleteAccount(dto: GetAccountInputResolver!): Boolean!
  createOperation(dto: CreateOperationInputResolver!): OperationModelResolver!
  updateOperation(dto: UpdateOperationInputResolver!): OperationModelResolver!
  deleteOperation(dto: GetOperationInputResolver!): Boolean!
  createOperationLink(dto: CreateOperationLinkInputResolver!): OperationLinkModelResolver!
  deleteOperationLink(dto: GetOperationLinkInputResolver!): Boolean!
}
```
