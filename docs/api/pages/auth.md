[back](../tableOfContent.md)
* [Input](#input)
  * [AuthInput](#authinput-optionable-false)
* [Output](#output)
  * [AuthModelResolver](#authmodelresolver-optionable-false)
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
### [AuthModelResolver](../assets/types/authmodelresolver.md) `optionable: false`
| fields |types |nullable |descriptions |deprecated |
| :----:  |:---:  |:--------:  |:----------:  |:--------:  |
| accessToken |String |false |Session token | |
| id |Int |false |Id of the user | |
| code |String |false |Code of the user | |
| name_first |String |false | | |
| name_last |String |false | | |
| description |String |false | | |
| mail |String |false | | |
| creation |String |false | | |
| modification |String |true | | |
| language |String |false | | 

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
    accessToken
    id
    code
    name_first
    name_last
    description
    mail
    creation
    modification
    language
  }
}
```
### Response
```json
{
  "data": {
    "auth": {
      "accessToken": "Bob",
      "id": 0,
      "code": "Bob",
      "name_first": "Bob",
      "name_last": "Bob",
      "description": "Bob",
      "mail": "Bob",
      "creation": "Bob",
      "modification": "Bob",
      "language": "Bob"
    }
  }
}
```