# 🔐 File Server - Servidor de Arquivos Seguro

Um servidor Express.js com autenticação JWT que permite upload seguro de arquivos e gestão de arquivos estáticos.

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** com tokens de 24h
- 📤 **Upload seguro** (apenas usuários autenticados)
- 📁 **Gestão de arquivos** (listar, eliminar)
- 🌐 **Acesso público** a arquivos específicos
- 🛡️ **Validação rigorosa** de tipos de arquivo
- 🚫 **Rate limiting** contra spam
- 📊 **Logging de segurança**
- 🐳 **Docker ready**

## Instalação

1. Instalar dependências:

```bash
npm install
```

2. Iniciar o servidor:

```bash
npm start
```

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação.

### Login

```bash
POST /login
{
  "password": "admin123"
}
```

### Usar Token

```bash
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📁 Endpoints da API

### 🔓 **Endpoints Públicos**

- `GET /health` - Health check
- `GET /public/:filename` - Acesso direto a arquivos
- `POST /login` - Login

### 🔒 **Endpoints Protegidos** (requerem autenticação)

- `POST /upload` - Upload de arquivos
- `GET /files` - Listar arquivos
- `GET /files/:filename` - Informações de arquivo
- `DELETE /files/:filename` - Eliminar arquivo

## 🛡️ Segurança

- **Rate Limiting**: 10 uploads por IP a cada 15 minutos
- **Validação**: Apenas tipos de arquivo seguros (PDF, imagens, documentos)
- **Tamanho**: Máximo 5MB por arquivo
- **Logging**: Todas as tentativas de acesso são registadas

## 🚀 Exemplos de Uso

### Fluxo Completo

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' | jq -r '.token')

# 2. Upload (protegido)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@documento.pdf" \
  http://localhost:3000/upload

# 3. Listar arquivos (protegido)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/files

# 4. Acesso público ao arquivo
curl http://localhost:3000/public/documento-1759640920865.pdf

# 5. Eliminar arquivo (protegido)
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/files/documento-1759640920865.pdf
```

## 🐳 Docker

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📚 Documentação Completa

- **[API-DOCS.md](API-DOCS.md)** - Documentação completa da API
- **[README-Docker.md](README-Docker.md)** - Guia Docker
- **[SECURITY.md](SECURITY.md)** - Guia de segurança

### Aceder a um arquivo:

```bash
curl http://localhost:3000/files/nome-do-arquivo
```

## Estrutura do Projeto

```
file-server/
├── server.js          # Servidor principal
├── package.json       # Dependências e scripts
├── uploads/           # Pasta onde os arquivos são guardados (criada automaticamente)
└── README.md          # Este ficheiro
```

## Configurações

- **Porta:** 3000 (padrão) ou definida pela variável de ambiente `PORT`
- **Limite de arquivo:** 10MB
- **Pasta de uploads:** `./uploads/`
- **CORS:** Habilitado para todas as origens
