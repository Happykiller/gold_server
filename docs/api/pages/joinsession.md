[back](../tableOfContent.md)
* [Input](#input)
  * [JoinSessionInputResolver](#joinsessioninputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation joinSession
 
## Input
### [JoinSessionInputResolver](../assets/inputs/joinsessioninputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| sessionId |Float |false | | | |
| username |String |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  joinSession (
    dto: {
      sessionId: 69.85019650427078
      username: "38uk9r707b"
    }
  )
}
```
### Response
```json
{
  "data": {
    "joinSession": true
  }
}
```