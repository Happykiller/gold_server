[back](../../tableOfContent.md)


```graphql
type Mutation {
  createSession(dto: CreateSessionInputResolver!): SessionRecordObjectResolver!
  joinSession(dto: JoinSessionInputResolver!): Boolean!
  createItem(dto: CreateItemInputResolver!): Boolean!
  createVote(dto: CreateVoteInputResolver!): Boolean!
  reveal(dto: RevealInputResolver!): Boolean!
}
```
