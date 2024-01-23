[back](../tableOfContent.md)
* [Output](#output)
  * [HelloModelResolver](#hellomodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# subscription subHello
 
## Output
### [HelloModelResolver](../assets/types/hellomodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| message |String |true | | 

## Errors
## Example
### Request
```graphql
subscription {
  subHello {
    message
  }
}
```
### Response
```json
{
  "data": {
    "subHello": {
      "message": "Bob"
    }
  }
}
```