# Dockerfile for the Capoeira Moves API (Node.js + Express).
# Build from the repo root once the API source exists under src/:
#   docker build -f deploy/Dockerfile -t capoeira-api:0.1.0 .

FROM node:20-alpine

# Run as the built-in non-root node user.
WORKDIR /app

# Install dependencies first to leverage layer caching.
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source.
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", "src/server.js"]
