# 🐳 File Server - Docker

Configuração simplificada usando apenas Dockerfile e docker-compose.yml.

## 🚀 Início Rápido

### 1. Executar com Docker

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### 2. Configurar no Provedor (Coolify/Heroku/etc)

Configure as seguintes variáveis de ambiente no painel do seu provedor:

**Variáveis obrigatórias:**

- `JWT_SECRET`: Chave secreta para autenticação (ex: `sua-chave-super-segura-com-32-caracteres`)
- `ADMIN_PASSWORD`: Senha do administrador (ex: `MinhaSenh@123!`)
- `ALLOWED_ORIGINS`: Domínios permitidos para CORS (ex: `https://seudominio.com`)

**Variáveis opcionais:**

- `PORT`: Porta do servidor (padrão: `3000`)
- `NODE_ENV`: Ambiente (padrão: `production`)

### 3. Acessar o Servidor

- **URL**: http://localhost:3000 (local) ou https://seu-dominio.com (produção)
- **Health Check**: `/health`
- **Upload**: POST `/upload`
- **Listar arquivos**: GET `/files` (requer autenticação)

## 🔧 Comandos Úteis

```bash
# Ver status
docker-compose ps

# Reiniciar serviço
docker-compose restart

# Ver logs em tempo real
docker-compose logs -f file-server

# Acessar container
docker-compose exec file-server sh

# Limpar tudo
docker-compose down -v
docker system prune -f
```

## 📁 Estrutura de Arquivos

```
file-server/
├── Dockerfile              # Imagem da aplicação
├── docker-compose.yml      # Configuração do serviço
├── .dockerignore           # Arquivos ignorados
├── server.js               # Código da aplicação
├── package.json            # Dependências
└── uploads/                # Arquivos enviados (bind mount)
```

## 🔒 Segurança

- ✅ Container roda como usuário não-root
- ✅ Filesystem read-only (exceto uploads)
- ✅ Rate limiting configurado
- ✅ Validação de tipos de arquivo
- ✅ Sanitização de nomes de arquivo
- ✅ Health checks automáticos

## 📊 Monitoramento

```bash
# Verificar saúde
curl http://localhost:3000/health

# Ver uso de recursos
docker stats file-server-app

# Ver logs de segurança
docker-compose logs file-server | grep "SECURITY"
```

## 🚨 Troubleshooting

**Container não inicia:**

```bash
docker-compose logs file-server
```

**Problemas de permissão:**

```bash
sudo chown -R 1001:1001 uploads/
```

**Verificar configuração:**

```bash
docker-compose config
```

## 🔄 Atualizações

```bash
# Parar serviços
docker-compose down

# Atualizar código
git pull

# Rebuild e iniciar
docker-compose up -d --build
```

## 🚀 Deploy no Coolify

### 1. Preparar o Repositório

```bash
# Fazer commit dos arquivos
git add .
git commit -m "Add Docker configuration"
git push origin main
```

### 2. Configurar no Coolify

1. **Criar novo projeto** no Coolify
2. **Conectar repositório** (GitHub/GitLab)
3. **Configurar variáveis de ambiente:**
   - `JWT_SECRET`: Sua chave secreta (32+ caracteres)
   - `ADMIN_PASSWORD`: Senha forte do admin
   - `ALLOWED_ORIGINS`: Seu domínio (ex: `https://seuapp.coolify.io`)

### 3. Deploy Automático

O Coolify irá:

- ✅ Detectar o `Dockerfile`
- ✅ Construir a imagem automaticamente
- ✅ Configurar rede e volumes
- ✅ Aplicar as variáveis de ambiente
- ✅ Disponibilizar o serviço

### 4. Verificar Deploy

```bash
# Testar health check
curl https://seuapp.coolify.io/health

# Testar upload (com autenticação)
curl -X POST https://seuapp.coolify.io/upload \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@arquivo.pdf"
```

## 🔧 Comandos para Provedores

### Coolify

- Acesse o painel web para gerenciar
- Logs em tempo real disponíveis
- Redeploy automático com git push

### Heroku

```bash
# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Configurar variáveis
heroku config:set JWT_SECRET="sua-chave"
```

### Railway

```bash
# Deploy automático
git push origin main

# Ver logs
railway logs
```

---

**⚠️ IMPORTANTE:** Configure variáveis de ambiente seguras no painel do provedor!
