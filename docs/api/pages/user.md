[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query user
 
## Output
The output is a **UserModelResolver**
## Errors
## Example
### Request
```graphql
query {
  user
}
```
### Response
```json
{
  "data": {
    "user": UserModelResolver
  }
}
```