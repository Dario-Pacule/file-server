# Use uma imagem Node.js oficial e segura
FROM node:18-alpine

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (para cache de layers)
COPY package*.json ./

# Instalar dependências de produção apenas
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código da aplicação
COPY server.js ./
COPY env.example ./

# Criar diretório de uploads com permissões corretas
RUN mkdir -p /app/uploads && \
    chown -R nodejs:nodejs /app && \
    chmod -R 755 /app

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
