# 使用最新的 Node.js LTS image
FROM node:18

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安裝項目依賴
RUN npm install

COPY . .

EXPOSE 3000

# 啟動 Server
CMD ["npm", "run", "dev"]
