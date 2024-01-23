[back](../../tableOfContent.md)


```graphql
type Query {
  task_getAll: [TaskRecord!]!
  session(dto: SessionInputResolver!): SessionDetailsRecordObjectResolver!
  sessions: [SessionRecordObjectResolver!]!
}
```
