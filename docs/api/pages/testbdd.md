[back](../tableOfContent.md)
* [Output](#output)
  * [TestModelResolver](#testmodelresolver-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query testBdd
 
## Output
### [TestModelResolver](../assets/types/testmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| resultat |Boolean |true | | 

## Errors
## Example
### Request
```graphql
query {
  testBdd {
    resultat
  }
}
```
### Response
```json
{
  "data": {
    "testBdd": {
      "resultat": true
    }
  }
}
```