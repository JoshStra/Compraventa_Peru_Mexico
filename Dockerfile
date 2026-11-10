FROM node:24.12.0-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --include=dev
COPY frontend/index.html frontend/vite.config.js ./frontend/
COPY frontend/src ./frontend/src
RUN npm run build

FROM node:24.12.0-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev --workspace backend --include-workspace-root=false

FROM node:24.12.0-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=development HOST=0.0.0.0 PORT=3000
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node backend/package.json ./backend/package.json
COPY --chown=node:node backend/src ./backend/src
COPY --chown=node:node backend/migrations ./backend/migrations
COPY --from=build --chown=node:node /app/frontend/dist ./frontend/dist
RUN mkdir -p /app/backend/.data/images && chown -R node:node /app/backend/.data
USER node
EXPOSE 3000
CMD ["node", "backend/src/server.js"]
