# ARG TO BE DEFINED:
# - TAG
# - APP
# - PORT

# For all available tags look at https://hub.docker.com/repository/docker/lbriza/shared/tags
ARG TAG=base-latest

FROM lbriza/shared:${TAG} AS shared

################################
# Corepack preparation
COPY package.json .
RUN corepack prepare "$(jq -r '.packageManager' package.json)" --activate && \
    rm package.json

################################
# Setup turbo on the shared image base
FROM shared AS base

WORKDIR /application
RUN npm install turbo --global && \
    pnpm config set store-dir /application/.pnpm-store

################################
# Prune project
FROM base AS pruner
ARG APP

WORKDIR /application
COPY . .
RUN turbo prune @lukasbriza/${APP} --docker

################################
# Build the project
FROM base AS builder
ARG APP

# Copy codestyle configuration files
COPY --from=pruner /application/.npmrc /application/tsconfig.json /application/.eslintrc.cjs /application/.prettierignore /application/prettier.config.js /application/
COPY --from=pruner /application/scripts /application/scripts/

WORKDIR /application

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /application/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /application/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /application/out/json/ .

# Download node prune
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
# Install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=/application/.pnpm-store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /application/out/full/ .

WORKDIR /application/apps/${APP}

# Remove generated prisma client if exists and generate new prisma code
RUN rm -rf ./src/modules/prisma/generated && \
    pnpm prisma:generate

# Build and ceanup
WORKDIR /application
RUN turbo build --filter=@lukasbriza/${APP}

# Copy libquery_engine-linux-musl-openssl-3.0.x.so.node in deployment folder
RUN cp ./apps/${APP}/src/modules/prisma/generated/libquery_engine-linux-musl-openssl-3.0.x.so.node ./apps/${APP}/build/modules/prisma/generated

# Prune and remove unecessary files
RUN --mount=type=cache,id=pnpm,target=/application/.pnpm-store pnpm prune --prod --no-optional && \
    rm -rf ./.turbo && \
    rm -rf ./**/*/src && \
    rm -rf ./**/*/test && \
    rm -rf ./**/*/tests && \
    rm -rf ./**/*/.turbo && \
    rm -rf ./**/*/*.md && \
    node-prune && \
    sh -c "rm -rf $(pnpm store path)"

################################
# Final image
FROM shared AS runner
ARG APP
ARG PORT=3001

ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"
ENV TZ=Europe/Prague

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /application
COPY --from=builder --chown=nodejs:nodejs /application .

WORKDIR /application/apps/${APP}
# Optionaly will need to tun prisma migrate command in compose "command" key,
# to ensure, that DB is always actual.
CMD sh -c "pnpm start -p ${PORT}"
