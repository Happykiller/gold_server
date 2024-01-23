[back](../tableOfContent.md)
* [Output](#output)
  * [HelloModelResolver](#hellomodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query hello
 
## Output
### [HelloModelResolver](../assets/types/hellomodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| message |String |true | | 

## Errors
## Example
### Request
```graphql
query {
  hello {
    message
  }
}
```
### Response
```json
{
  "data": {
    "hello": {
      "message": "Bob"
    }
  }
}
```