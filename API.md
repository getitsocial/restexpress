<a name="top"></a>
# restexpress v1.0.0

restexpress api Documentation

 - [Auth](#Auth)
   - [Authenticate](#Authenticate)
   - [Authenticate with Facebook or Google](#Authenticate-with-Facebook-or-Google)
   - [logout current user](#logout-current-user)
 - [Message](#Message)
   - [Create message](#Create-message)
   - [Delete message](#Delete-message)
   - [Retrieve message](#Retrieve-message)
   - [Retrieve messages](#Retrieve-messages)
   - [Update message](#Update-message)
 - [User](#User)
   - [Create user](#Create-user)
   - [Delete user](#Delete-user)
   - [Retrieve current user](#Retrieve-current-user)
   - [Retrieve user](#Retrieve-user)
   - [Retrieve users](#Retrieve-users)
   - [Update password](#Update-password)
   - [Update user](#Update-user)

___


# <a name='Auth'></a> Auth

## <a name='Authenticate'></a> Authenticate
[Back to top](#top)

```
POST /auth
```

### Headers - `Header`

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| Authorization | `String` | <p>Basic authorization with email and password.</p> |

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>Master access_token.</p> |

### Success response

#### Success response - `Success 201`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| token | `String` | <p>User <code>access_token</code> to be passed to other requests.</p> |
| user | `Object` | <p>Current user's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 401 |  | <p>Master access only or invalid credentials.</p> |

## <a name='Authenticate-with-Facebook-or-Google'></a> Authenticate with Facebook or Google
[Back to top](#top)

```
POST /auth/:provider
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>Facebook or Google user accessToken.</p> |

### Success response

#### Success response - `Success 201`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| token | `String` | <p>User <code>access_token</code> to be passed to other requests.</p> |
| user | `Object` | <p>Current user's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 401 |  | <p>Invalid credentials.</p> |

## <a name='logout-current-user'></a> logout current user
[Back to top](#top)

```
POST /auth/logout
```

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 401 |  | <p>Invalid credentials.</p> |

# <a name='Message'></a> Message

## <a name='Create-message'></a> Create message
[Back to top](#top)

```
POST /messages
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>user access token.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| message | `Object` | <p>Message's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 404 |  | <p>Message not found.</p> |
| 401 |  | <p>user access only.</p> |

## <a name='Delete-message'></a> Delete message
[Back to top](#top)

```
DELETE /messages/:id
```

### Success response

#### Success response - `Success 204`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 204 |  | <p>No Content.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 404 |  | <p>Message not found.</p> |

## <a name='Retrieve-message'></a> Retrieve message
[Back to top](#top)

```
GET /messages/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>user access token.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| message | `Object` | <p>Message's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 404 |  | <p>Message not found.</p> |

## <a name='Retrieve-messages'></a> Retrieve messages
[Back to top](#top)

```
GET /messages
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>user access token.</p> |
| q | `String` | **optional** <p>Query to search.</p> |
| page | `Number` | **optional** <p>Page number.</p>_Default value: 1_<br>_Size range: 1..30_<br> |
| limit | `Number` | **optional** <p>Amount of returned items.</p>_Default value: 30_<br>_Size range: 1..100_<br> |
| sort | `String[]` | **optional** <p>Order of returned items.</p>_Default value: -createdAt_<br> |
| fields | `String[]` | **optional** <p>Fields to be returned.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| messages | `Object[]` | <p>List of messages.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |

## <a name='Update-message'></a> Update message
[Back to top](#top)

```
PUT /messages/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>user access token.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| message | `Object` | <p>Message's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 404 |  | <p>Message not found.</p> |

# <a name='User'></a> User

## <a name='Create-user'></a> Create user
[Back to top](#top)

```
POST /users
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>Master access_token.</p> |
| email | `String` | <p>User's email.</p> |
| password | `String` | <p>User's password.</p>_Size range: 6.._<br> |
| name | `String` | **optional** <p>User's name.</p> |
| picture | `String` | **optional** <p>User's picture.</p> |
| role | `String` | **optional** <p>User's role.</p>_Default value: user_<br>_Allowed values: user,admin_ |

### Success response

#### Success response - `Sucess 201`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401 |  | <p>Master access only.</p> |
| 409 |  | <p>Email already registered.</p> |

## <a name='Delete-user'></a> Delete user
[Back to top](#top)

```
DELETE /users/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>User access_token.</p> |

### Success response

#### Success response - `Success 204`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 204 |  | <p>No Content.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 401 |  | <p>Admin access only.</p> |
| 404 |  | <p>User not found.</p> |

## <a name='Retrieve-current-user'></a> Retrieve current user
[Back to top](#top)

```
GET /users/me
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>User access_token.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| user | `Object` | <p>User's data.</p> |

## <a name='Retrieve-user'></a> Retrieve user
[Back to top](#top)

```
GET /users/:id
```

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 404 |  | <p>User not found.</p> |

## <a name='Retrieve-users'></a> Retrieve users
[Back to top](#top)

```
GET /users
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>User access_token.</p> |
| q | `String` | **optional** <p>Query to search.</p> |
| page | `Number` | **optional** <p>Page number.</p>_Default value: 1_<br>_Size range: 1..30_<br> |
| limit | `Number` | **optional** <p>Amount of returned items.</p>_Default value: 30_<br>_Size range: 1..100_<br> |
| sort | `String[]` | **optional** <p>Order of returned items.</p>_Default value: -createdAt_<br> |
| fields | `String[]` | **optional** <p>Fields to be returned.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| users | `Object[]` | <p>List of users.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401 |  | <p>user access only.</p> |

## <a name='Update-password'></a> Update password
[Back to top](#top)

```
PUT /users/:id/password
```

### Headers - `Header`

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| Authorization | `String` | <p>Basic authorization with email and password.</p> |

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| password | `String` | <p>User's new password.</p>_Size range: 6.._<br> |

### Success response

#### Success response - `Success 201`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401 |  | <p>Current user access only.</p> |
| 404 |  | <p>User not found.</p> |

## <a name='Update-user'></a> Update user
[Back to top](#top)

```
PUT /users/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| access_token | `String` | <p>User access_token.</p> |
| name | `String` | **optional** <p>User's name.</p> |
| picture | `String` | **optional** <p>User's picture.</p> |

### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| 400 | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401 |  | <p>Current user or admin access only.</p> |
| 404 |  | <p>User not found.</p> |
