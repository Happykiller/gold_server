[back](../tableOfContent.md)
* [Input](#input)
  * [UpdateAccountInputResolver](#updateaccountinputresolver-optionable-false)
* [Output](#output)
  * [AccountModelResolver](#accountmodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation updateAccount
 
## Input
### [UpdateAccountInputResolver](../assets/inputs/updateaccountinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| type_id |Int |true | |1, regular by default | |
| parent_account_id |Int |true | | | |
| label |String |true | | | |
| account_id |Int |false | | | 

## Output
### [AccountModelResolver](../assets/types/accountmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| type_id |Int |false |1, regular by default | |
| parent_account_id |Int |true | | |
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
mutation {
  updateAccount (
    dto: {
      type_id: 0
      parent_account_id: 0
      label: "Bob"
      account_id: 0
    }
  ) {
    id
    type_id
    parent_account_id
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
    "updateAccount": {
      "id": 0,
      "type_id": 0,
      "parent_account_id": 0,
      "label": "Bob",
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