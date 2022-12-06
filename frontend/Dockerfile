FROM node:17-alpine as build

WORKDIR /app

ARG REACT_APP_SUPABASE_URL=https://fwlekvzjrcebahremkit.supabase.co
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL

ARG REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bGVrdnpqcmNlYmFocmVta2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg1NDU5MTUsImV4cCI6MTk4NDEyMTkxNX0.xa6oyW0QWlqX3lPGPERLMczo18xsVQYOr-wpRQBooOU
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY

ARG REACT_APP_BACKEND_URL=https://supa-react-backend.fly.dev
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

ENV NODE_ENV production

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html