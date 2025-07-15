FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

ARG NEXT_PUBLIC_SERVICE
ARG NEXT_PUBLIC_POLAR_ACCESS_TOKEN
ARG NEXT_PUBLIC_TRACK_DOMAIN

ENV NEXT_PUBLIC_SERVICE=${NEXT_PUBLIC_SERVICE}
ENV NEXT_PUBLIC_POLAR_ACCESS_TOKEN=${NEXT_PUBLIC_POLAR_ACCESS_TOKEN}
ENV NEXT_PUBLIC_TRACK_DOMAIN=${NEXT_PUBLIC_TRACK_DOMAIN}

# Install dependencies
RUN yarn install --ignore-engines

# Build application
RUN yarn build

# Expose port
EXPOSE 3000

# Start command
CMD ["yarn", "start"]