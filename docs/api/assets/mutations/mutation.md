[back](../../tableOfContent.md)


```graphql
type Mutation {
  update_password(dto: UpdPasswordAuthResolverDto!): AuthModelResolver!
  create_passkey(dto: CreatePasskeyResolverDto!): PasskeyResolverModel!
  delete_passkey(dto: DeletePasskeyResolverDto!): Boolean!
  create_user(dto: CreateUserResolverDto!): UserModelResolver!
  createAccount(dto: CreateAccountInputResolver!): AccountModelResolver!
  updateAccount(dto: UpdateAccountInputResolver!): AccountModelResolver!
  deleteAccount(dto: GetAccountInputResolver!): Boolean!
  createOperation(dto: CreateOperationInputResolver!): OperationModelResolver!
  updateOperation(dto: UpdateOperationInputResolver!): OperationModelResolver!
  deleteOperation(dto: GetOperationInputResolver!): Boolean!
  createOperationLink(dto: CreateOperationLinkInputResolver!): OperationLinkModelResolver!
  deleteOperationLink(dto: GetOperationLinkInputResolver!): Boolean!
  cloneOperations(dto: CloneOperationInputResolver!): [OperationModelResolver!]!
}
```
