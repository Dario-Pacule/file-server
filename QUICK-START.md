# 🚀 Quick Start - File Server

Guia de início rápido para o File Server.

## ⚡ Início em 5 Minutos

### 1. Clone e Configure

```bash
git clone <seu-repositorio>
cd file-server
npm install
```

### 2. Configurar Variáveis

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar com suas configurações
nano .env
```

**Configurações importantes:**

```env
JWT_SECRET=sua-chave-super-segura-32-caracteres-minimo
ADMIN_PASSWORD=MinhaSenh@123!
```

### 3. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 4. Testar

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

## 🐳 Docker (Ainda Mais Rápido)

### 1. Configurar no Provedor

Configure as variáveis no painel do seu provedor (Coolify/Heroku/Railway):

- `JWT_SECRET`: Sua chave secreta
- `ADMIN_PASSWORD`: Senha do admin

### 2. Deploy

```bash
# Push para repositório
git push origin main

# Deploy automático no provedor
```

## 📋 Checklist de Segurança

- [ ] ✅ Alterar `JWT_SECRET` para valor seguro
- [ ] ✅ Alterar `ADMIN_PASSWORD` para senha forte
- [ ] ✅ Configurar `ALLOWED_ORIGINS` em produção
- [ ] ✅ Verificar logs de segurança
- [ ] ✅ Testar upload e acesso a arquivos

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
npm run dev          # Iniciar com auto-reload
npm run start:env    # Iniciar com variáveis de ambiente
npm audit           # Verificar vulnerabilidades
```

### Docker

```bash
docker-compose up -d --build    # Construir e iniciar
docker-compose logs -f          # Ver logs
docker-compose down             # Parar
docker-compose restart          # Reiniciar
```

### Testes

```bash
# Health check
curl http://localhost:3000/health

# Login e upload
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' | jq -r '.token')

curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@teste.pdf" \
  http://localhost:3000/upload
```

## 🚨 Troubleshooting

### Problemas Comuns

**Servidor não inicia:**

```bash
# Verificar logs
npm run dev

# Verificar porta
netstat -tulpn | grep 3000
```

**Erro de autenticação:**

```bash
# Verificar token
echo $TOKEN

# Fazer novo login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

**Upload falha:**

```bash
# Verificar tamanho do arquivo
ls -lh arquivo.pdf

# Verificar tipo de arquivo
file arquivo.pdf
```

### Docker Issues

**Container não inicia:**

```bash
docker-compose logs file-server
docker-compose config
```

**Permissões:**

```bash
sudo chown -R 1001:1001 uploads/
chmod -R 755 uploads/
```

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs de Segurança

```bash
# Docker
docker-compose logs file-server | grep "SECURITY"

# Local
npm run dev | grep "SECURITY"
```

### Métricas

```bash
# Docker
docker stats file-server-app

# Espaço em disco
du -sh uploads/
```

## 🎯 Próximos Passos

1. **Configurar SSL/TLS** para produção
2. **Implementar backup** automático
3. **Configurar monitoramento** (logs, métricas)
4. **Testar** em ambiente de produção
5. **Documentar** processos específicos

## 📞 Suporte

- **Logs**: Verifique sempre os logs primeiro
- **Documentação**: Consulte API-DOCS.md
- **Segurança**: Consulte SECURITY.md
- **Docker**: Consulte README-Docker.md

---

**🎉 Parabéns!** Seu File Server está funcionando! 🚀
