[back](../tableOfContent.md)
* [Input](#input)
  * [SubSessionInputResolver](#subsessioninputresolver-optionable-false)
* [Output](#output)
  * [SessionDetailsRecordObjectResolver](#sessiondetailsrecordobjectresolver-optionable-false)
  * [[SessionItemRecordObjectResolver]](#[sessionitemrecordobjectresolver]-optionable-true)
  * [[SessionVoteRecordObjectResolver]](#[sessionvoterecordobjectresolver]-optionable-true)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# subscription subToSession
 
## Input
### [SubSessionInputResolver](../assets/inputs/subsessioninputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| sessionId |Float |false | | | 

## Output
### [SessionDetailsRecordObjectResolver](../assets/types/sessiondetailsrecordobjectresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Float |true | | |
| name |String |true | | |
| voting |[String] |true | | |
| members |[String] |true | | |
| items |[[SessionItemRecordObjectResolver]](../assets/types/sessionitemrecordobjectresolver.md) |true | | 
### [[SessionItemRecordObjectResolver]](../assets/types/sessionitemrecordobjectresolver.md) `optionable: true`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Float |true | | |
| author |String |true | | |
| name |String |true | | |
| state |String |true | | |
| votes |[[SessionVoteRecordObjectResolver]](../assets/types/sessionvoterecordobjectresolver.md) |true | | 
### [[SessionVoteRecordObjectResolver]](../assets/types/sessionvoterecordobjectresolver.md) `optionable: true`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  

## Errors
## Example
### Request
```graphql
subscription {
  subToSession (
    dto: {
      sessionId: 69.85019650427078
    }
  ) {
    id
    name
    voting
    members
    items {
      id
      author
      name
      state
      votes {
        ...
      }
    }
  }
}
```
### Response
```json
{
  "data": {
    "subToSession": {
      "id": 69.85019650427078,
      "name": "38uk9r707b",
      "voting": [
        "38uk9r707b",
        "38uk9r707b"
      ],
      "members": [
        "38uk9r707b",
        "38uk9r707b"
      ],
      "items": [
      {
        "id": 69.85019650427078,
        "author": "38uk9r707b",
        "name": "38uk9r707b",
        "state": "38uk9r707b",
        "votes": [
        {
          ...
        }
        ]
      }
      ]
    }
  }
}
```