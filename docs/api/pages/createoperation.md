[back](../tableOfContent.md)
* [Input](#input)
  * [CreateOperationInputResolver](#createoperationinputresolver-optionable-false)
* [Output](#output)
  * [OperationModelResolver](#operationmodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation createOperation
 
## Input
### [CreateOperationInputResolver](../assets/inputs/createoperationinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| account_id |Int |false | | | |
| account_id_dest |Int |true | | | |
| amount |Float |false | | | |
| date |String |false | | | |
| status_id |Int |false | | | |
| type_id |Int |false | | | |
| third_id |Int |true | | | |
| category_id |Int |true | | | |
| description |String |true | | | 

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
mutation {
  createOperation (
    dto: {
      account_id: 0
      account_id_dest: 0
      amount: 42
      date: "Bob"
      status_id: 0
      type_id: 0
      third_id: 0
      category_id: 0
      description: "Bob"
    }
  ) {
    id
    account_id
    account_id_dest
    amount
    date
    status_id
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
    "createOperation": {
      "id": 0,
      "account_id": 0,
      "account_id_dest": 0,
      "amount": 42,
      "date": "Bob",
      "status_id": 0,
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