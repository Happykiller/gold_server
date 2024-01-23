[back](../tableOfContent.md)
* [Input](#input)
  * [CreateItemInputResolver](#createiteminputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation createItem
 
## Input
### [CreateItemInputResolver](../assets/inputs/createiteminputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| sessionId |Float |false | | | |
| name |String |false | | | |
| author |String |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  createItem (
    dto: {
      sessionId: 69.85019650427078
      name: "38uk9r707b"
      author: "38uk9r707b"
    }
  )
}
```
### Response
```json
{
  "data": {
    "createItem": true
  }
}
```