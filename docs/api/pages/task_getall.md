[back](../tableOfContent.md)
* [Output](#output)
  * [[TaskRecord]](#[taskrecord]-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query task_getAll
 
## Output
### [[TaskRecord]](../assets/types/taskrecord.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| name |String |true | | 

## Errors
## Example
### Request
```graphql
query {
  task_getAll {
    name
  }
}
```
### Response
```json
{
  "data": {
    "task_getAll": [
      {
        "name": "38uk9r707b"
      }
    ]
  }
}
```