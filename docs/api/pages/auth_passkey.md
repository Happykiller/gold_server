[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query auth_passkey
 
## Output
The output is a **AuthModelResolver**
## Errors
## Example
### Request
```graphql
query {
  auth_passkey
}
```
### Response
```json
{
  "data": {
    "auth_passkey": AuthModelResolver
  }
}
```