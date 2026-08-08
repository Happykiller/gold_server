[back](../tableOfContent.md)
* [Output](#output)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query operations
 
## Output
The output is a **[OperationModelResolver**
## Errors
## Example
### Request
```graphql
query {
  operations
}
```
### Response
```json
{
  "data": {
    "operations": OperationModelResolver
  }
}
```