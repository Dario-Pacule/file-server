# 📚 Documentação do File Server

Índice completo da documentação do File Server.

## 🚀 Início Rápido

### [QUICK-START.md](QUICK-START.md)

Guia de início rápido para configurar o File Server em 5 minutos.

## 📖 Documentação Principal

### [README.md](README.md)

Visão geral do projeto, funcionalidades e instalação básica.

### [API-DOCS.md](API-DOCS.md)

Documentação completa da API com todos os endpoints, exemplos e códigos de resposta.

## 🐳 Docker e Deploy

### [README-Docker.md](README-Docker.md)

Guia completo para Docker, docker-compose e deploy em provedores como Coolify.

## 🔒 Segurança

### [SECURITY.md](SECURITY.md)

Guia de segurança com medidas implementadas, configurações e melhores práticas.

## ⚙️ Configuração

### [DOTENV_SETUP.md](DOTENV_SETUP.md)

Guia para configuração de variáveis de ambiente.

## 📁 Estrutura de Arquivos

```
file-server/
├── 📚 Documentação
│   ├── README.md              # Visão geral
│   ├── API-DOCS.md            # Documentação da API
│   ├── QUICK-START.md         # Início rápido
│   ├── README-Docker.md       # Guia Docker
│   ├── SECURITY.md            # Guia de segurança
│   ├── DOTENV_SETUP.md        # Configuração de ambiente
│   └── DOCS.md                # Este índice
│
├── 🐳 Docker
│   ├── Dockerfile             # Imagem Docker
│   ├── docker-compose.yml     # Orquestração
│   └── .dockerignore          # Arquivos ignorados
│
├── ⚙️ Configuração
│   ├── package.json          # Dependências
│   ├── env.example            # Exemplo de variáveis
│   └── server.js              # Código principal
│
└── 📁 Dados
    └── uploads/               # Arquivos enviados
```

## 🎯 Por Onde Começar?

### Para Desenvolvedores

1. **[QUICK-START.md](QUICK-START.md)** - Configuração rápida
2. **[API-DOCS.md](API-DOCS.md)** - Entender a API
3. **[SECURITY.md](SECURITY.md)** - Configurações de segurança

### Para DevOps

1. **[README-Docker.md](README-Docker.md)** - Deploy com Docker
2. **[SECURITY.md](SECURITY.md)** - Configurações de produção
3. **[DOTENV_SETUP.md](DOTENV_SETUP.md)** - Variáveis de ambiente

### Para Administradores

1. **[SECURITY.md](SECURITY.md)** - Configurações de segurança
2. **[API-DOCS.md](API-DOCS.md)** - Monitoramento e logs
3. **[README-Docker.md](README-Docker.md)** - Manutenção

## 🔧 Configurações por Ambiente

### Desenvolvimento

- Usar `npm run dev`
- Configurar `.env` local
- Testar com `curl` ou Postman

### Produção

- Usar Docker ou provedor de nuvem
- Configurar variáveis no painel do provedor
- Configurar SSL/TLS
- Implementar backup

## 📊 Monitoramento

### Health Checks

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

## 🚨 Troubleshooting

### Problemas Comuns

- **Servidor não inicia**: Verificar logs e configurações
- **Erro de autenticação**: Verificar token e credenciais
- **Upload falha**: Verificar tamanho e tipo de arquivo
- **Docker issues**: Verificar logs e configuração

### Logs Importantes

- Tentativas de login falhadas
- Uploads bloqueados
- Acesso não autorizado
- Erros de validação

## 🔄 Atualizações

### Código

```bash
git pull origin main
npm install
npm start
```

### Docker

```bash
docker-compose down
docker-compose up -d --build
```

### Variáveis de Ambiente

- Atualizar no painel do provedor
- Reiniciar serviço após mudanças

## 📞 Suporte

### Documentação

- Consulte sempre a documentação primeiro
- Verifique logs para diagnóstico
- Teste em ambiente de desenvolvimento

### Recursos

- **Logs**: Sempre verifique os logs primeiro
- **Health Check**: Use `/health` para verificar status
- **Configuração**: Verifique variáveis de ambiente
- **Segurança**: Consulte SECURITY.md para configurações

---

**📝 Nota**: Esta documentação é mantida atualizada. Para dúvidas específicas, consulte a documentação relevante ou verifique os logs do sistema.
