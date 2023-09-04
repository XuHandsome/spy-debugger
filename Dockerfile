# Stage 1: Build
FROM node:20.5.1-alpine3.18 AS build

WORKDIR /app

# Copy package.json and yarn.lock to the container
# COPY ./src package.json yarn.lock ./
COPY . ./

# Install dependencies
RUN yarn install

# Stage 2: Run
FROM node:20.5.1-alpine3.18 AS run

# Create the directory for spy-debugger
RUN mkdir -p /usr/local/lib/node_modules/spy-debugger

WORKDIR /usr/local/lib/node_modules/spy-debugger

# Copy necessary files from the build stage
COPY --from=build /app/README.md ./README.md
COPY --from=build /app/LICENSE ./LICENSE
COPY --from=build /app/lib ./lib
COPY --from=build /app/buildin_modules ./buildin_modules
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/template ./template
COPY --from=build /app/package.json ./package.json

# Grant executable permission to the index.js file
RUN pwd \
  && ls -l \
  && chmod +x ./lib/index.js

# Create a symbolic link for spy-debugger
RUN ln -s /usr/local/lib/node_modules/spy-debugger/lib/index.js /usr/local/bin/spy-debugger

# Set the command to run spy-debugger
CMD ["spy-debugger"]

# Expose ports 9888 and 19888
EXPOSE 9888 19888