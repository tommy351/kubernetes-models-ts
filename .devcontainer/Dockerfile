FROM mcr.microsoft.com/devcontainers/typescript-node:18

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@8

# Install additional dev tools
RUN apt-get update && apt-get install -y \
    jq \
    curl \
    git \
    vim \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/kubernetes-models-ts

# Set up pnpm to work in the container
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
RUN pnpm config set store-dir /usr/local/share/.pnpm-store
