[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query operation
 
## Output
The output is a **OperationModelResolver**
## Errors
## Example
### Request
```graphql
query {
  operation
}
```
### Response
```json
{
  "data": {
    "operation": OperationModelResolver
  }
}
```