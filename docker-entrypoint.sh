#!/bin/sh
set -eu

# Persistent Docker/Railway volumes normally mount as root-owned directories.
# Keep the bootstrap privileged step minimal and run the Node app unprivileged.
if [ "$(id -u)" -eq 0 ]; then
  mkdir -p /data
  chown -R node:node /data
  exec su-exec node "$@"
fi

exec "$@"
