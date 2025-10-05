# 🔧 Configuração do Dotenv

## Como Configurar Variáveis de Ambiente

### 1. **Criar Ficheiro .env**

Crie um ficheiro `.env` na raiz do projeto com o seguinte conteúdo:

```bash
# Configurações do File Server
PORT=3000
JWT_SECRET=sua-chave-secreta-super-segura-aqui-mude-em-producao
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=*
```

### 2. **Comandos para Executar com Dotenv**

#### **Opção A: Usar Scripts NPM (Recomendado)**

```bash
# Para desenvolvimento
npm run dev:env

# Para produção
npm run start:env
```

#### **Opção B: Usar dotenv/config diretamente**

```bash
# Para desenvolvimento
npx nodemon -r dotenv/config server.js

# Para produção
npx node -r dotenv/config server.js
```

#### **Opção C: Usar dotenv no código (já configurado)**

```bash
# Funciona automaticamente
npm start
npm run dev
```

### 3. **Variáveis de Ambiente Disponíveis**

| Variável          | Descrição                    | Valor Padrão                          |
| ----------------- | ---------------------------- | ------------------------------------- |
| `PORT`            | Porta do servidor            | `3000`                                |
| `JWT_SECRET`      | Chave secreta para JWT       | `sua-chave-secreta-super-segura-aqui` |
| `ADMIN_PASSWORD`  | Password do administrador    | `admin123`                            |
| `ALLOWED_ORIGINS` | Origens permitidas para CORS | `*`                                   |

### 4. **Exemplo de Ficheiro .env Completo**

```bash
# Servidor
PORT=3000

# Segurança
JWT_SECRET=minha-chave-super-secreta-com-32-caracteres-minimo-123456789
ADMIN_PASSWORD=MinhaPasswordSegura123!

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://meusite.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_UPLOADS=10
RATE_LIMIT_MAX_REQUESTS=100

# Upload
MAX_FILE_SIZE=5242880
MAX_FILES_PER_REQUEST=1
```

### 5. **Verificar se Está Funcionando**

Execute o servidor e verifique se as variáveis estão sendo carregadas:

```bash
npm run dev:env
```

Deve ver no console:

```
Servidor a correr na porta 3000
Pasta de uploads: /caminho/para/uploads
```

### 6. **Troubleshooting**

#### **Problema: Variáveis não carregam**

- Verifique se o ficheiro `.env` está na raiz do projeto
- Verifique se não há espaços em branco em volta do `=`
- Verifique se não há aspas desnecessárias

#### **Problema: Ficheiro .env não é reconhecido**

- Certifique-se que o ficheiro se chama exatamente `.env` (com ponto)
- Verifique se está na pasta raiz do projeto
- Reinicie o servidor após criar o ficheiro

#### **Problema: Ainda usa valores padrão**

- Verifique se o `require('dotenv').config()` está no topo do `server.js`
- Tente usar `npm run start:env` em vez de `npm start`

### 7. **Segurança**

⚠️ **IMPORTANTE**:

- **NUNCA** commite o ficheiro `.env` para o Git
- Use valores diferentes em produção
- Mantenha as chaves secretas seguras
- O ficheiro `.env` já está no `.gitignore`
