[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query auth
 
## Output
The output is a **AuthModelResolver**
## Errors
## Example
### Request
```graphql
query {
  auth
}
```
### Response
```json
{
  "data": {
    "auth": AuthModelResolver
  }
}
```