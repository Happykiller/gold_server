[back](../../tableOfContent.md)


```graphql
type Query {
  ping: PingResponse!
  auth(dto: AuthAuthResolverDto!): AuthModelResolver!
  auth_passkey(dto: PasskeyAuthResolverDto!): AuthModelResolver!
  getSessionInfo: AuthModelResolver!
  passkeys_for_user: [PasskeyResolverModel!]!
  systemInfo: SystemInfoResolverModel!
  test_mail: SendMailSystemResolverModel!
  users: [UserModelResolver!]!
  user(dto: GetUserResolverDto!): UserModelResolver!
  accounts: [AccountModelResolver!]!
  account(dto: GetAccountInputResolver!): AccountModelResolver!
  accountTypes: [AccountTypeModelResolver!]!
  operations(dto: GetOperationsInputResolver!): [OperationModelResolver!]!
  cashflow(dto: CashflowInputResolver!): [CashflowModelResolver!]!
  operation(dto: GetOperationInputResolver!): OperationModelResolver!
  operationTypes: [OperationTypeModelResolver!]!
  operationCategories: [OperationCategoryModelResolver!]!
  operationStatus: [OperationStatutModelResolver!]!
  operationThirds: [OperationThirdModelResolver!]!
  operationLinks(dto: GetOperationInputResolver!): [OperationLinkModelResolver!]!
}
```
