[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query passkeys_for_user
 
## Output
The output is a **[PasskeyResolverModel**
## Errors
## Example
### Request
```graphql
query {
  passkeys_for_user
}
```
### Response
```json
{
  "data": {
    "passkeys_for_user": PasskeyResolverModel
  }
}
```