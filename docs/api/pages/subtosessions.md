[back](../tableOfContent.md)
* [Output](#output)
  * [[SessionRecordObjectResolver]](#[sessionrecordobjectresolver]-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# subscription subToSessions
 
## Output
### [[SessionRecordObjectResolver]](../assets/types/sessionrecordobjectresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Float |true | | |
| name |String |true | | |
| voting |[String] |true | | 

## Errors
## Example
### Request
```graphql
subscription {
  subToSessions {
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
    "subToSessions": [
      {
        "id": 69.85019650427078,
        "name": "38uk9r707b",
        "voting": [
          "38uk9r707b",
          "38uk9r707b"
        ]
      }
    ]
  }
}
```