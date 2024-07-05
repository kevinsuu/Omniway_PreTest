# 會員系統 API

歡迎使用會員系統 API。此 API 允許用戶註冊、登錄、更改密碼，以及使用 JWT 驗證訪問受保護的虛擬數據。

## API 說明

### 帳號註冊

- URL: /api/register
- method: POST
- 功能敘述: 註冊新帳號。
- Request Body:

```
{
"username": "example",
"password": "password123"
}
```

- Response :
  - Sucess: 201 Created。
  - Failed: 400 Bad Request。

### 帳號登錄

- URL: /api/login
- Method: POST
- 功能敘述: 驗證用戶並返回 JWT Token 和 Refresh Token。
- Request Body:

  ```
  {
  "username": "example",
  "password": "password123"
  }
  ```

- Response :
  - Sucess: 200 OK。
  - Failed: 204 No Content。

### 更改密碼

- URL: /api/change-password
- Method: POST
- 功能敘述: 更改已驗證用戶的密碼。
- Header:
  - Authorization: Bearer <jwt_token>
- Request Body:

  ````
  {
    "account":"kevin"
    "password": "password",
    "newPassword": "password123"
  }```

  ````

- Response :
  Sucess: 200 OK。
  JWT Token 失效或過期: 401 Unauthorized。
  舊密碼不正確: 403 Forbidden。

### 取得測試資料

- URL: /api/dummy-data
- Method: GET
- 功能敘述: 測試資料
- Header:
  - Authorization: Bearer <jwt_token>
- Response :
  Token 有效: 200 OK 並帶測試資料。
  Token 過期: 202 Accepted，並說明相關資訊。
  Token 無效: 404 Not Found，並說明相關資訊。

### 驗證 RefreshToken 並重發新的 Token

- URL: /api/validate-refresh-token
- Method: POST
- 功能敘述: 驗證 RefreshToken 並回傳新的 JWT Token。
- Request Body:

  ```
  {
  "refreshToken": "your_refresh_token"
  }
  ```

- Response :
  Sucess: 200 OK 並回傳新的 JWT Token。
  Token 不正確: 403 Forbidden。

## 部屬方式

```
git clone https://github.com/kevinsuu/Omniway_PreTest.git
cd Omniway_PreTest
docker-compose up --build -d
```

## .env 說明

- PORT:設定 server 端口，預設為 3000。
- MONGO_URI:設定 MongoDB 的連接 URI。
- JWT_SECRET:設定 JWT 密鑰。
- JWT_EXPIRES_IN:設定 JWT Token 的過期時間
- REFRESH_TOKEN_EXPIRES_IN:設定 Refresh Token 的過期時間
