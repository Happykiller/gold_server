[back](../tableOfContent.md)
* [Input](#input)
  * [AuthInput](#authinput-optionable-false)
* [Output](#output)
  * [AuthType](#authtype-optionable-false)
* [Errors](#errors)
* [Example](#example)
  * [Request](#request)
  * [Response](#response)

# query auth
 
## Input
### [AuthInput](../assets/inputs/authinput.md) `optionable: false`
| fields |types |optionable |default |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:-----:  |:----------:  |:--------:  |
| login |String |false | |User code for the session | |
| password |String |false | |Password for the session | 

## Output
### [AuthType](../assets/types/authtype.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| id |Int |false |Id of the user | |
| code |String |false |Code of the user | |
| accessToken |String |false |Session token | 

## Errors
## Example
### Request
```graphql
query {
  auth (
    dto: {
      login: "Bob"
      password: "Bob"
    }
  ) {
    id
    code
    accessToken
  }
}
```
### Response
```json
{
  "data": {
    "auth": {
      "id": 0,
      "code": "Bob",
      "accessToken": "Bob"
    }
  }
}
```