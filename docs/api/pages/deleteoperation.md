[back](../tableOfContent.md)
* [Input](#input)
  * [GetOperationInputResolver](#getoperationinputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation deleteOperation
 
## Input
### [GetOperationInputResolver](../assets/inputs/getoperationinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| operation_id |Int |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  deleteOperation (
    dto: {
      operation_id: 0
    }
  )
}
```
### Response
```json
{
  "data": {
    "deleteOperation": true
  }
}
```