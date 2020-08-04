# Frontend
FROM node:12-alpine AS frontend
WORKDIR /build/frontend
COPY ./frontend .
RUN npm i
RUN npm run build

# Backend
FROM node:12-alpine AS backend
WORKDIR /build/backend
COPY ./backend .
RUN npm i
RUN npm run build
RUN npm prune

# Final image
FROM node:12-alpine
WORKDIR /app
COPY --from=frontend /build/frontend/dist ./frontend/dist
COPY --from=backend /build/backend/dist ./backend/dist
COPY --from=backend /build/backend/node_modules ./backend/node_modules
COPY --from=backend /build/backend/package.json ./backend/package.json
EXPOSE 80
CMD ["node", "backend/dist/main.js"]
