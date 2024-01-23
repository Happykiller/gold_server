[back](../tableOfContent.md)
* [Output](#output)
  * [[AccountTypeModelResolver]](#[accounttypemodelresolver]-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query accountTypes
 
## Output
### [[AccountTypeModelResolver]](../assets/types/accounttypemodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false | | |
| label |String |false | | |
| description |String |true | | |
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
  accountTypes {
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
    "accountTypes": [
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