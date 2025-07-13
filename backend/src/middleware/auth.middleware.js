/*
 Última atualização em 06/05/2025 por Lucas Rafael da Silva
 Refatorado para middlewares genéricos e flexíveis. Redução de duplicação e melhoria da segurança.
 Projeto: Plataforma de Denúncias Públicas
*/

const jwt = require("jsonwebtoken");

function extractTokenData(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw { status: 401, message: "Código de acesso não encontrado." };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });

    req.user = decoded.user;
    req.userId = decoded.userId;
    req.isAdmin = decoded.admin;
    req.admin = decoded.admin;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw { status: 401, message: "Código de acesso inválido." };
    } else if (error.name === "TokenExpiredError") {
      throw { status: 401, message: "Código de acesso expirado." };
    } else {
      console.error("Erro na autenticação:", error);
      throw { status: 401, message: "Falha na autenticação." };
    }
  }
}

// Middleware genérico para validar o token JWT
function validateToken(req, res, next) {
  try {
    extractTokenData(req);
    next();
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Middleware para autorizar apenas admins
function isAdmin(req, res, next) {
  try {
    extractTokenData(req);
    if (!req.isAdmin) {
      return res
        .status(403)
        .json({ message: "Acesso negado. Privilégios de administrador necessários." });
    }
    next();
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// Middleware genérico para verificar se é o dono do recurso ou admin
function ensureUserIsOwner(paramKey = "id") {
  return (req, res, next) => {
    try {
      extractTokenData(req);

      if (req.isAdmin) return next();

      const requestedUserId = parseInt(req.params[paramKey], 10);
      if (req.userId !== requestedUserId) {
        return res.status(403).json({
          message: "Acesso negado. Você só pode acessar seus próprios dados.",
        });
      }

      next();
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };
}

module.exports = { validateToken, isAdmin, ensureUserIsOwner };
