# Servidor de Arquivos Express.js com Multer

Um servidor Express.js que permite fazer upload de arquivos e servir arquivos estáticos.

## Funcionalidades

- ✅ Upload de arquivos únicos (1 de cada vez)
- ✅ Criação automática da pasta `uploads` se não existir
- ✅ Listagem de todos os arquivos
- ✅ Servir arquivos estáticos
- ✅ Obter informações de arquivos específicos
- ✅ Eliminar arquivos
- ✅ Limite de tamanho de arquivo (10MB)
- ✅ CORS habilitado

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

## Endpoints

### POST /upload

Envia um arquivo para o servidor.

**Formato:** `multipart/form-data`
**Campo:** `file`

**Resposta de sucesso:**

```json
{
  "success": true,
  "message": "Arquivo enviado com sucesso",
  "file": {
    "originalName": "documento.pdf",
    "filename": "file-1234567890-123456789.pdf",
    "size": 1024,
    "url": "/files/file-1234567890-123456789.pdf"
  }
}
```

### GET /files

Lista todos os arquivos no servidor.

**Resposta:**

```json
{
  "success": true,
  "files": [
    {
      "filename": "file-1234567890-123456789.pdf",
      "size": 1024,
      "created": "2024-01-01T10:00:00.000Z",
      "modified": "2024-01-01T10:00:00.000Z",
      "url": "/files/file-1234567890-123456789.pdf"
    }
  ],
  "count": 1
}
```

### GET /files/:filename

Obtém informações de um arquivo específico.

### DELETE /files/:filename

Elimina um arquivo específico.

### GET /health

Verifica a saúde do servidor.

## Acesso aos Arquivos

Os arquivos podem ser acedidos diretamente através de:

```
http://localhost:3000/files/nome-do-arquivo
```

## Exemplo de Uso com cURL

### Upload de arquivo:

```bash
curl -X POST -F "file=@caminho/para/arquivo.pdf" http://localhost:3000/upload
```

### Listar arquivos:

```bash
curl http://localhost:3000/files
```

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
