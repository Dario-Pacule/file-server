# 📚 File Server - Documentação da API

Servidor de arquivos Express.js com autenticação JWT e upload seguro.

## 🚀 Início Rápido

### Configuração

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações

# Iniciar servidor
npm start
```

### Docker

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação.

### Login

```bash
POST /login
Content-Type: application/json

{
  "password": "admin123"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar Token

```bash
# Incluir token no header Authorization
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📁 Endpoints da API

### 🔓 **Endpoints Públicos** (sem autenticação)

#### Health Check

```bash
GET /health
```

**Resposta:**

```json
{
  "success": true,
  "message": "Servidor funcionando corretamente",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

#### Acesso Público a Arquivos

```bash
GET /public/:filename
```

**Exemplo:**

```bash
curl http://localhost:3000/public/documento.pdf
```

**Resposta:** Arquivo binário diretamente

---

### 🔒 **Endpoints Protegidos** (requerem autenticação)

#### Upload de Arquivo

```bash
POST /upload
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: [arquivo]
```

**Exemplo:**

```bash
curl -X POST \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@documento.pdf" \
  http://localhost:3000/upload
```

**Resposta:**

```json
{
  "success": true,
  "message": "Arquivo enviado com sucesso",
  "file": {
    "originalName": "documento.pdf",
    "savedAs": "documento-1759640920865.pdf",
    "size": 1024000,
    "url": "/files/documento-1759640920865.pdf",
    "publicUrl": "/public/documento-1759640920865.pdf",
    "preserved": false
  }
}
```

#### Listar Arquivos

```bash
GET /files
Authorization: Bearer TOKEN
```

**Exemplo:**

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/files
```

**Resposta:**

```json
{
  "success": true,
  "files": [
    {
      "filename": "documento-1759640920865.pdf",
      "size": 1024000,
      "created": "2024-01-01T10:00:00.000Z",
      "modified": "2024-01-01T10:00:00.000Z",
      "url": "/files/documento-1759640920865.pdf"
    }
  ],
  "count": 1
}
```

#### Informações de Arquivo

```bash
GET /files/:filename
Authorization: Bearer TOKEN
```

**Exemplo:**

```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/files/documento.pdf
```

**Resposta:**

```json
{
  "success": true,
  "file": {
    "filename": "documento.pdf",
    "size": 1024000,
    "created": "2024-01-01T10:00:00.000Z",
    "modified": "2024-01-01T10:00:00.000Z",
    "url": "/files/documento.pdf"
  }
}
```

#### Eliminar Arquivo

```bash
DELETE /files/:filename
Authorization: Bearer TOKEN
```

**Exemplo:**

```bash
curl -X DELETE \
  -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/files/documento.pdf
```

**Resposta:**

```json
{
  "success": true,
  "message": "Arquivo eliminado com sucesso"
}
```

## 🛡️ Segurança

### Rate Limiting

- **Uploads**: 10 por IP a cada 15 minutos
- **API Requests**: 100 por IP a cada 15 minutos

### Validação de Arquivos

- **Tamanho máximo**: 5MB
- **Arquivos por upload**: 1
- **Tipos permitidos**: Imagens, PDFs, documentos Office, ZIP, RAR, TXT, CSV, JSON
- **Extensões bloqueadas**: .exe, .bat, .js, .php, .sh, etc.

### Headers de Segurança

- Helmet.js configurado
- CORS restritivo
- Content Security Policy

## 📋 Códigos de Status HTTP

| Código | Significado            |
| ------ | ---------------------- |
| 200    | Sucesso                |
| 400    | Dados inválidos        |
| 401    | Não autenticado        |
| 403    | Token inválido         |
| 404    | Arquivo não encontrado |
| 429    | Rate limit excedido    |
| 500    | Erro interno           |

## 🚨 Tratamento de Erros

### Erro de Autenticação

```json
{
  "success": false,
  "message": "Token de acesso necessário"
}
```

### Arquivo Muito Grande

```json
{
  "success": false,
  "message": "Arquivo muito grande. Limite máximo: 5MB"
}
```

### Tipo de Arquivo Não Permitido

```json
{
  "success": false,
  "message": "Tipo de arquivo não permitido por motivos de segurança"
}
```

### Rate Limit Excedido

```json
{
  "success": false,
  "message": "Muitos uploads. Tente novamente em 15 minutos."
}
```

## 🔧 Configuração de Produção

### Variáveis de Ambiente

```bash
# Obrigatórias
JWT_SECRET=sua-chave-secreta-super-segura-32-caracteres-minimo
ADMIN_PASSWORD=senha-forte-com-numeros-e-simbolos

# Opcionais
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://seudominio.com
```

### Docker

```bash
# Deploy com Docker
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 📊 Exemplos Práticos

### Fluxo Completo

```bash
# 1. Fazer login
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' | jq -r '.token')

# 2. Upload de arquivo
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@documento.pdf" \
  http://localhost:3000/upload

# 3. Listar arquivos
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/files

# 4. Acesso público ao arquivo
curl http://localhost:3000/public/documento-1759640920865.pdf

# 5. Eliminar arquivo
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/files/documento-1759640920865.pdf
```

### JavaScript (Frontend)

```javascript
// Login
const login = async (password) => {
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return response.json();
};

// Upload
const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return response.json();
};

// Listar arquivos
const listFiles = async (token) => {
  const response = await fetch("/files", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
```

## 🔍 Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs de Segurança

```bash
# Ver logs de tentativas de acesso
docker-compose logs file-server | grep "SECURITY"

# Ver logs de uploads bloqueados
docker-compose logs file-server | grep "BLOCKED"
```

### Métricas

```bash
# Uso de recursos (Docker)
docker stats file-server-app

# Espaço em disco
du -sh uploads/
```

## 🚀 Deploy

### Coolify/Heroku/Railway

1. Conectar repositório
2. Configurar variáveis de ambiente
3. Deploy automático

### Docker

```bash
# Build e deploy
docker-compose up -d --build

# Verificar
curl http://localhost:3000/health
```

---

**📞 Suporte:** Consulte os logs para troubleshooting e verifique as configurações de segurança.
