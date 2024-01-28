[back](../tableOfContent.md)
* [Input](#input)
  * [GetOperationInputResolver](#getoperationinputresolver-optionable-false)
* [Output](#output)
  * [[OperationLinkModelResolver]](#[operationlinkmodelresolver]-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query operationLinks
 
## Input
### [GetOperationInputResolver](../assets/inputs/getoperationinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| operation_id |Int |false | | | 

## Output
### [[OperationLinkModelResolver]](../assets/types/operationlinkmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| operation_id |Int |false | | |
| operation_ref_id |Int |false | | |
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
  operationLinks (
    dto: {
      operation_id: 0
    }
  ) {
    id
    operation_id
    operation_ref_id
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
    "operationLinks": [
      {
        "id": 0,
        "operation_id": 0,
        "operation_ref_id": 0,
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