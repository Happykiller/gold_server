[back](../tableOfContent.md)
* [Input](#input)
  * [CreateOperationLinkInputResolver](#createoperationlinkinputresolver-optionable-false)
* [Output](#output)
  * [OperationLinkModelResolver](#operationlinkmodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation createOperationLink
 
## Input
### [CreateOperationLinkInputResolver](../assets/inputs/createoperationlinkinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| operationA_id |Int |false | | | |
| operationB_id |Int |false | | | 

## Output
### [OperationLinkModelResolver](../assets/types/operationlinkmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| operationA_id |Int |false | | |
| operationB_id |Int |false | | |
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
  createOperationLink (
    dto: {
      operationA_id: 0
      operationB_id: 0
    }
  ) {
    id
    operationA_id
    operationB_id
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
    "createOperationLink": {
      "id": 0,
      "operationA_id": 0,
      "operationB_id": 0,
      "active": true,
      "creator_id": 0,
      "creation_date": "Bob",
      "modificator_id": 0,
      "modification_date": "Bob"
    }
  }
}
```