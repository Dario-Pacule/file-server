# 🔒 Guia de Segurança - File Server

## Medidas de Segurança Implementadas

### 🛡️ **Autenticação e Autorização**

- **JWT Tokens**: Autenticação baseada em tokens JWT com expiração de 24h
- **Proteção de Endpoints**: Todos os endpoints de gestão de arquivos requerem autenticação
- **Login Seguro**: Endpoint `/login` com validação de password

### 🚫 **Rate Limiting**

- **Uploads**: Máximo 10 uploads por IP a cada 15 minutos
- **API Requests**: Máximo 100 requests por IP a cada 15 minutos
- **Proteção contra DDoS**: Limitação automática de tráfego

### 📁 **Validação de Arquivos**

- **Whitelist de MIME Types**: Apenas tipos de arquivo seguros permitidos
- **Extensões Perigosas Bloqueadas**: `.exe`, `.bat`, `.js`, `.php`, etc.
- **Sanitização de Nomes**: Remoção de caracteres perigosos e path traversal
- **Limite de Tamanho**: Máximo 5MB por arquivo
- **Um arquivo por vez**: Prevenção de uploads em massa

### 🔐 **Headers de Segurança**

- **Helmet.js**: Headers de segurança automáticos
- **CSP**: Content Security Policy configurado
- **CORS**: Configuração restritiva de origens

### 📊 **Logging de Segurança**

- **Eventos Registados**:
  - Tentativas de login falhadas
  - Acesso não autorizado
  - Tokens inválidos
  - Uploads de arquivos bloqueados
  - Erros de validação

### 🚨 **Tipos de Arquivo Permitidos**

```
✅ Imagens: JPEG, PNG, GIF, WebP
✅ Documentos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
✅ Texto: TXT, CSV, JSON
✅ Arquivos: ZIP, RAR
```

### ❌ **Extensões Bloqueadas**

```
❌ Executáveis: .exe, .bat, .cmd, .com, .pif, .scr
❌ Scripts: .js, .vbs, .jar, .php, .asp, .jsp
❌ Shell: .sh, .ps1, .py, .rb, .pl, .cgi
```

## 🔧 **Configuração de Produção**

### 1. **Variáveis de Ambiente**

```bash
# MUDAR EM PRODUÇÃO!
JWT_SECRET=chave-super-secreta-com-32-caracteres-minimo
ADMIN_PASSWORD=password-muito-forte-e-complexa
ALLOWED_ORIGINS=https://meusite.com,https://app.meusite.com
```

### 2. **Configurações Recomendadas**

- **HTTPS**: Sempre usar HTTPS em produção
- **Firewall**: Restringir acesso por IP se necessário
- **Backup**: Backup regular da pasta `uploads`
- **Monitorização**: Monitorizar logs de segurança

### 3. **Comandos de Segurança**

```bash
# Verificar dependências vulneráveis
npm audit

# Atualizar dependências
npm update

# Verificar permissões da pasta uploads
chmod 755 uploads/
```

## 🚨 **Alertas de Segurança**

### **Logs a Monitorizar**

```bash
# Tentativas de login suspeitas
[SECURITY] FAILED_LOGIN

# Acesso não autorizado
[SECURITY] UNAUTHORIZED_ACCESS

# Arquivos perigosos bloqueados
[SECURITY] BLOCKED_FILE_UPLOAD

# Tokens inválidos
[SECURITY] INVALID_TOKEN
```

### **Resposta a Incidentes**

1. **Verificar logs** de segurança
2. **Bloquear IPs** suspeitos se necessário
3. **Alterar passwords** se comprometidas
4. **Revisar arquivos** enviados recentemente

## 📋 **Checklist de Segurança**

- [ ] JWT_SECRET alterado para valor seguro
- [ ] ADMIN_PASSWORD alterado para password forte
- [ ] ALLOWED_ORIGINS configurado corretamente
- [ ] HTTPS configurado em produção
- [ ] Logs de segurança sendo monitorizados
- [ ] Backup da pasta uploads configurado
- [ ] Firewall configurado se necessário
- [ ] Dependências atualizadas regularmente

## 🔍 **Testes de Segurança**

### **Testar Rate Limiting**

```bash
# Fazer múltiplos requests rapidamente
for i in {1..15}; do curl http://localhost:3000/files; done
```

### **Testar Upload de Arquivo Perigoso**

```bash
# Tentar upload de .exe (deve ser bloqueado)
curl -X POST -F "file=@test.exe" http://localhost:3000/upload
```

### **Testar Autenticação**

```bash
# Tentar aceder sem token (deve falhar)
curl http://localhost:3000/files

# Login correto
curl -X POST -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' http://localhost:3000/login
```

## 📞 **Suporte de Segurança**

Em caso de suspeita de compromisso:

1. **Parar o servidor** imediatamente
2. **Verificar logs** de segurança
3. **Alterar todas as credenciais**
4. **Revisar arquivos** na pasta uploads
5. **Contactar administrador** do sistema
