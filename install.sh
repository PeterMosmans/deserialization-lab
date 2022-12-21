#!/usr/bin/env bash
# PGCM - (c)2022 - support@go-forward.net - GPLv3

# This script should be run as root

# Stop as soon as we encounter an error: Shouldn't happen
set -e

apt update
apt install -y \
    curl \
    docker-compose \
    docker.io \
    git \
    inotify-tools \
    mousepad \
    nodejs \
    npm
# The node-serialize package should be available for all users
npm install --global node-serialize
# Ensure that global packages are available for all users
# Ensure that the NODE_PATH environment variable is set by default for bash
grep -qL NODE_PATH /etc/profile || echo "export NODE_PATH=/usr/local/lib/node_modules" >> /etc/profile
# Ensure that all zsh users get the NODE_PATH into their environment
# shellcheck disable=SC2156
find /home/*/.zshrc -exec sh -c 'grep -qL NODE_PATH {} || echo "export NODE_PATH=/usr/local/lib/node_modules" >> {}' \;

grep -qL tmo /etc/hosts || echo "127.0.0.1 tmo" >> /etc/hosts
# Clone git repository containing the servers
mkdir -p /srv/lab
git clone --depth=1 https://github.com/PeterMosmans/deserialization-lab /srv/lab
pushd /srv/lab && docker-compose up --detach

# Note that purposefully, a tail of the log is shown in the foreground
# This way, students immediately can see the results
echo
echo
docker logs -f nest
