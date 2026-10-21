FROM node:22-alpine
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/missions.sqlite
WORKDIR /app
COPY --chown=node:node . .
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3000
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://localhost:3000/api/v1/health').then(r => {if (!r.ok) process.exit(1)}).catch(() => process.exit(1))"
CMD ["node", "services/dead-drop/server.mjs"]
