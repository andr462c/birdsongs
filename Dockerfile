FROM node:20-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# Pass your xeno-canto API key via: docker run -e KEY=your_key ...
CMD ["npx", "vite", "--host", "0.0.0.0"]
