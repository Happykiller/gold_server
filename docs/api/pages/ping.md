[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query ping
 
## Output
The output is a **PingResponse**
## Errors
## Example
### Request
```graphql
query {
  ping
}
```
### Response
```json
{
  "data": {
    "ping": PingResponse
  }
}
```