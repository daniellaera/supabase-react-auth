FROM node:17-alpine as build

WORKDIR /app

RUN --mount=type=secret,id=REACT_APP_SUPABASE_URL \
    --mount=type=secret,id=REACT_APP_SUPABASE_ANON_KEY \
    --mount=type=secret,id=REACT_APP_BACKEND_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html