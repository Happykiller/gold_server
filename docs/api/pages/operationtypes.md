[back](../tableOfContent.md)
* [Output](#output)
  * [[OperationTypeModelResolver]](#[operationtypemodelresolver]-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query operationTypes
 
## Output
### [[OperationTypeModelResolver]](../assets/types/operationtypemodelresolver.md) `optionable: false`
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
  operationTypes {
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
    "operationTypes": [
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