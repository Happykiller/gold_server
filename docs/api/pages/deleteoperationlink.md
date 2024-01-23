[back](../tableOfContent.md)
* [Input](#input)
  * [GetOperationLinkInputResolver](#getoperationlinkinputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation deleteOperationLink
 
## Input
### [GetOperationLinkInputResolver](../assets/inputs/getoperationlinkinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| operation_link_id |Int |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  deleteOperationLink (
    dto: {
      operation_link_id: 0
    }
  )
}
```
### Response
```json
{
  "data": {
    "deleteOperationLink": true
  }
}
```