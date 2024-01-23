[back](../tableOfContent.md)
* [Input](#input)
  * [RevealInputResolver](#revealinputresolver-optionable-false)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# mutation reveal
 
## Input
### [RevealInputResolver](../assets/inputs/revealinputresolver.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| sessionId |Float |false | | | |
| itemId |Float |false | | | 

## Output
The output is a **Boolean**
## Errors
## Example
### Request
```graphql
mutation {
  reveal (
    dto: {
      sessionId: 69.85019650427078
      itemId: 69.85019650427078
    }
  )
}
```
### Response
```json
{
  "data": {
    "reveal": true
  }
}
```