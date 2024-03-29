[back](../tableOfContent.md)
* [Input](#input)
  * [GetAccountInputResolver](#getaccountinputresolver-optionable-false)
* [Output](#output)
  * [AccountModelResolver](#accountmodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query account
 
## Input
### [GetAccountInputResolver](../assets/inputs/getaccountinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| account_id |Int |false | | | 

## Output
### [AccountModelResolver](../assets/types/accountmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| type_id |Int |false |1, regular by default | |
| parent_account_id |Int |true | | |
| label |String |false | | |
| description |String |true | | |
| balance_reconcilied |Float |true | | |
| balance_not_reconcilied |Float |true | | |
| creator_id |Int |false | | |
| creation_date |String |false | | |
| modificator_id |Int |true | | |
| modification_date |String |true | | 

## Errors
## Example
### Request
```graphql
query {
  account (
    dto: {
      account_id: 0
    }
  ) {
    id
    type_id
    parent_account_id
    label
    description
    balance_reconcilied
    balance_not_reconcilied
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
    "account": {
      "id": 0,
      "type_id": 0,
      "parent_account_id": 0,
      "label": "Bob",
      "description": "Bob",
      "balance_reconcilied": 42,
      "balance_not_reconcilied": 42,
      "creator_id": 0,
      "creation_date": "Bob",
      "modificator_id": 0,
      "modification_date": "Bob"
    }
  }
}
```