// Carregar variáveis de ambiente primeiro
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Configurações de segurança
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 uploads por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Muitos uploads. Tente novamente em 15 minutos.'
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP a cada 15 minutos
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Aplicar rate limiting
app.use('/upload', uploadLimiter);
app.use('/files', apiLimiter);

// Pasta onde os arquivos serão guardados
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Criar pasta uploads se não existir
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('Pasta uploads criada com sucesso');
}

// Tipos de arquivo permitidos (whitelist)
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-rar-compressed',
  'application/json',
  'text/csv'
];

// Extensões perigosas bloqueadas
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.php', '.asp', '.jsp', '.sh', '.ps1', '.py', '.rb', '.pl', '.cgi'
];

// Função para sanitizar nome do arquivo
function sanitizeFilename(filename) {
  // Remover caracteres perigosos
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remover caracteres inválidos
    .replace(/\.\./g, '') // Remover .. (path traversal)
    .replace(/^\.+/, '') // Remover pontos no início
    .trim();
}

// Função para verificar se a extensão é perigosa
function isDangerousExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  return DANGEROUS_EXTENSIONS.includes(ext);
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Sanitizar o nome do arquivo
    const sanitizedName = sanitizeFilename(file.originalname);

    // Se o nome ficou vazio após sanitização, usar um nome padrão
    const finalName = sanitizedName || `file-${Date.now()}`;
    const filePath = path.join(UPLOAD_DIR, finalName);

    if (fs.existsSync(filePath)) {
      // Se o arquivo já existe, adicionar timestamp ao nome
      const ext = path.extname(finalName);
      const nameWithoutExt = path.basename(finalName, ext);
      const timestamp = Date.now();
      const newName = `${nameWithoutExt}-${timestamp}${ext}`;
      cb(null, newName);
    } else {
      // Usar o nome sanitizado se não existir conflito
      cb(null, finalName);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite reduzido para 5MB
    files: 1, // Apenas 1 arquivo por vez
    fieldSize: 1024 * 1024 // Limite do campo
  },
  fileFilter: function (req, file, cb) {
    // Verificar se a extensão é perigosa
    if (isDangerousExtension(file.originalname)) {
      console.log(`Tentativa de upload de arquivo perigoso: ${file.originalname}`);
      return cb(new Error('Tipo de arquivo não permitido por motivos de segurança'), false);
    }

    // Verificar MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      console.log(`Tentativa de upload de MIME type não permitido: ${file.mimetype}`);
      return cb(new Error('Tipo de arquivo não permitido'), false);
    }

    // Verificar tamanho do nome do arquivo
    if (file.originalname.length > 255) {
      return cb(new Error('Nome do arquivo muito longo'), false);
    }

    cb(null, true);
  }
});

// Função de logging de segurança
function logSecurityEvent(event, details, req) {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`[SECURITY] ${timestamp} - ${event} - IP: ${ip} - User-Agent: ${userAgent} - Details: ${JSON.stringify(details)}`);
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logSecurityEvent('UNAUTHORIZED_ACCESS', { endpoint: req.path }, req);
    return res.status(401).json({
      success: false,
      message: 'Token de acesso necessário'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logSecurityEvent('INVALID_TOKEN', { endpoint: req.path, error: err.message }, req);
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }
    req.user = user;
    next();
  });
}

// Endpoint de login
app.post('/login', [
  body('password').notEmpty().withMessage('Password é obrigatória')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }

  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: token
    });
  } else {
    logSecurityEvent('FAILED_LOGIN', { password: '***' }, req);
    res.status(401).json({
      success: false,
      message: 'Password incorreta'
    });
  }
});

// Servir arquivos estáticos da pasta uploads (protegido)
app.use('/files', authenticateToken, express.static(UPLOAD_DIR));

// Endpoint para upload de arquivo único
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    res.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      file: {
        originalName: req.file.originalname,
        savedAs: req.file.filename,
        size: req.file.size,
        url: `/files/${req.file.filename}`,
        preserved: req.file.originalname === req.file.filename
      }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para listar todos os arquivos (protegido)
app.get('/files', authenticateToken, (req, res) => {
  try {
    fs.readdir(UPLOAD_DIR, (err, files) => {
      if (err) {
        console.error('Erro ao ler pasta:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao ler pasta de arquivos'
        });
      }

      const fileList = files.map(filename => {
        const filePath = path.join(UPLOAD_DIR, filename);
        const stats = fs.statSync(filePath);

        return {
          filename: filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: `/files/${filename}`
        };
      });

      res.json({
        success: true,
        files: fileList,
        count: fileList.length
      });
    });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para obter informações de um arquivo específico (público)
app.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    const stats = fs.statSync(filePath);

    res.json({
      success: true,
      file: {
        filename: filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/files/${filename}`
      }
    });
  } catch (error) {
    console.error('Erro ao obter informações do arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para eliminar um arquivo (protegido)
app.delete('/files/:filename', authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Arquivo eliminado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao eliminar arquivo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint de saúde
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  // Não retorna nada, a ligação fica pendente
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logSecurityEvent('MULTER_ERROR', {
      code: error.code,
      message: error.message,
      endpoint: req.path
    }, req);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Limite máximo: 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Muitos arquivos. Apenas 1 arquivo por vez é permitido'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de arquivo inválido. Use o campo "file"'
      });
    }
  }

  // Log de erros de segurança
  if (error.message.includes('não permitido') || error.message.includes('perigoso')) {
    logSecurityEvent('BLOCKED_FILE_UPLOAD', {
      error: error.message,
      filename: req.file?.originalname,
      endpoint: req.path
    }, req);
  }

  console.error('Erro não tratado:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  console.log(`Pasta de uploads: ${UPLOAD_DIR}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
