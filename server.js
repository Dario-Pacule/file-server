const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasta onde os arquivos serão guardados
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Criar pasta uploads se não existir
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('Pasta uploads criada com sucesso');
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Preservar o nome original do arquivo
    // Se já existir um arquivo com o mesmo nome, adicionar timestamp
    const originalName = file.originalname;
    const filePath = path.join(UPLOAD_DIR, originalName);

    if (fs.existsSync(filePath)) {
      // Se o arquivo já existe, adicionar timestamp ao nome
      const ext = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, ext);
      const timestamp = Date.now();
      const newName = `${nameWithoutExt}-${timestamp}${ext}`;
      cb(null, newName);
    } else {
      // Usar o nome original se não existir conflito
      cb(null, originalName);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  },
  fileFilter: function (req, file, cb) {
    // Aceitar todos os tipos de arquivo
    cb(null, true);
  }
});

// Servir arquivos estáticos da pasta uploads
app.use('/files', express.static(UPLOAD_DIR));

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

// Endpoint para listar todos os arquivos
app.get('/files', (req, res) => {
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

// Endpoint para obter informações de um arquivo específico
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

// Endpoint para eliminar um arquivo
app.delete('/files/:filename', (req, res) => {
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
  res.json({
    message: 'Servidor de arquivos Express.js com Multer',
    endpoints: {
      'POST /upload': 'Enviar um arquivo',
      'GET /files': 'Listar todos os arquivos',
      'GET /files/:filename': 'Obter informações de um arquivo',
      'DELETE /files/:filename': 'Eliminar um arquivo',
      'GET /health': 'Verificar saúde do servidor'
    }
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Limite máximo: 10MB'
      });
    }
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
