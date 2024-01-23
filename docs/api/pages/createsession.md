[back](../tableOfContent.md)
* [Input](#input)
  * [CreateSessionInputResolver](#createsessioninputresolver-optionable-false)
* [Output](#output)
  * [SessionRecordObjectResolver](#sessionrecordobjectresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation createSession
 
## Input
### [CreateSessionInputResolver](../assets/inputs/createsessioninputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| name |String |false | | | 

## Output
### [SessionRecordObjectResolver](../assets/types/sessionrecordobjectresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Float |true | | |
| name |String |true | | |
| voting |[String] |true | | 

## Errors
## Example
### Request
```graphql
mutation {
  createSession (
    dto: {
      name: "38uk9r707b"
    }
  ) {
    id
    name
    voting
  }
}
```
### Response
```json
{
  "data": {
    "createSession": {
      "id": 69.85019650427078,
      "name": "38uk9r707b",
      "voting": [
        "38uk9r707b",
        "38uk9r707b"
      ]
    }
  }
}
```