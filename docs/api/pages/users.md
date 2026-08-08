[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query users
 
## Output
The output is a **[UserModelResolver**
## Errors
## Example
### Request
```graphql
query {
  users
}
```
### Response
```json
{
  "data": {
    "users": UserModelResolver
  }
}
```