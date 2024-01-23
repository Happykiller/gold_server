[back](../tableOfContent.md)
* [Input](#input)
  * [GetOperationInputResolver](#getoperationinputresolver-optionable-false)
* [Output](#output)
  * [OperationModelResolver](#operationmodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query operation
 
## Input
### [GetOperationInputResolver](../assets/inputs/getoperationinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| operation_id |Int |false | | | 

## Output
### [OperationModelResolver](../assets/types/operationmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| account_id |Int |false | | |
| account_id_dest |Int |true | | |
| amount |Float |false | | |
| date |String |false | | |
| status_id |Int |false | | |
| sign |Boolean |false | | |
| type_id |Int |false | | |
| third_id |Int |true | | |
| category_id |Int |true | | |
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
  operation (
    dto: {
      operation_id: 0
    }
  ) {
    id
    account_id
    account_id_dest
    amount
    date
    status_id
    sign
    type_id
    third_id
    category_id
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
    "operation": {
      "id": 0,
      "account_id": 0,
      "account_id_dest": 0,
      "amount": 42,
      "date": "Bob",
      "status_id": 0,
      "sign": true,
      "type_id": 0,
      "third_id": 0,
      "category_id": 0,
      "description": "Bob",
      "active": true,
      "creator_id": 0,
      "creation_date": "Bob",
      "modificator_id": 0,
      "modification_date": "Bob"
    }
  }
}
```