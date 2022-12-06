FROM node:17-alpine as build

WORKDIR /app

ARG REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_URL $REACT_APP_SUPABASE_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=$REACT_APP_SUPABASE_URL

ENV NODE_ENV production

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html