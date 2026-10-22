FROM node:22-alpine
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/missions.sqlite
WORKDIR /app

# Railway and many Docker hosts mount volumes owned by root. Start with
# minimal root access only to prepare /data, then immediately drop to node.
RUN apk add --no-cache su-exec && mkdir -p /data
COPY --chown=node:node . .
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/dead-drop-entrypoint

EXPOSE 3000
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/v1/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
ENTRYPOINT ["dead-drop-entrypoint"]
CMD ["node", "services/dead-drop/server.mjs"]
