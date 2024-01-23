[back](../tableOfContent.md)
* [Output](#output)
  * [[OperationThirdsModelResolver]](#[operationthirdsmodelresolver]-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query operationThirds
 
## Output
### [[OperationThirdsModelResolver]](../assets/types/operationthirdsmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| label |String |false | | |
| description |String |false | | |
| active |Boolean |false | | |
| creator_id |Int |false | | |
| creation_date |String |false | | |
| modificator_id |Int |true | | |
| modification_date |String |true | | 

## Errors
## Example
### Request
```graphql
query {
  operationThirds {
    id
    label
    description
    active
    creator_id
    creation_date
    modificator_id
    modification_date
  }
}
```
### Response
```json
{
  "data": {
    "operationThirds": [
      {
        "id": 0,
        "label": "Bob",
        "description": "Bob",
        "active": true,
        "creator_id": 0,
        "creation_date": "Bob",
        "modificator_id": 0,
        "modification_date": "Bob"
      }
    ]
  }
}
```