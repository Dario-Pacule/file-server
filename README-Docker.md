# 🐳 File Server - Docker

Configuração simplificada usando apenas Dockerfile e docker-compose.yml.

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar com suas configurações
nano .env
```

**Variáveis importantes:**

- `JWT_SECRET`: Chave secreta para autenticação (mude em produção!)
- `ADMIN_PASSWORD`: Senha do administrador (mude em produção!)
- `ALLOWED_ORIGINS`: Domínios permitidos para CORS

### 2. Executar com Docker

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### 3. Acessar o Servidor

- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Upload**: POST http://localhost:3000/upload
- **Listar arquivos**: GET http://localhost:3000/files (requer autenticação)

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
├── .env                    # Variáveis de ambiente
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

---

**⚠️ IMPORTANTE:** Sempre configure variáveis de ambiente seguras em produção!
