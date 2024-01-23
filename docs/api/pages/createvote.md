[back](../tableOfContent.md)
* [Input](#input)
  * [CreateVoteInputResolver](#createvoteinputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation createVote
 
## Input
### [CreateVoteInputResolver](../assets/inputs/createvoteinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| sessionId |Float |false | | | |
| itemId |Float |false | | | |
| member |String |false | | | |
| vote |String |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  createVote (
    dto: {
      sessionId: 69.85019650427078
      itemId: 69.85019650427078
      member: "38uk9r707b"
      vote: "38uk9r707b"
    }
  )
}
```
### Response
```json
{
  "data": {
    "createVote": true
  }
}
```