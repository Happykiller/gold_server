[back](../tableOfContent.md)
* [Input](#input)
  * [GetAccountInputResolver](#getaccountinputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation deleteAccount
 
## Input
### [GetAccountInputResolver](../assets/inputs/getaccountinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| account_id |Int |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  deleteAccount (
    dto: {
      account_id: 0
    }
  )
}
```
### Response
```json
{
  "data": {
    "deleteAccount": true
  }
}
```