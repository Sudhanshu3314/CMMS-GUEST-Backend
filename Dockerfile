# 1️⃣ Use official Node.js runtime (small + fast)
FROM node:18-alpine

# 2️⃣ Set working directory inside container
WORKDIR /usr/src/app

# 3️⃣ Copy dependency files first
COPY package*.json ./

# 4️⃣ Install only production dependencies
RUN npm install --production

# 5️⃣ Copy all backend code
COPY . .

# 6️⃣ Expose your backend port
EXPOSE 8065

# 7️⃣ Define environment
ENV NODE_ENV=production

# 8️⃣ Start your backend
CMD ["node", "index.js"]