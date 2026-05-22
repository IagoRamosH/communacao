const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      isOrganization,
      organizationName,
    } = req.body;

    // validação
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Preencha todos os campos",
      });
    }

    // usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Usuário já existe",
      });
    }

    // hash senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 lógica de organização
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      isOrganization: isOrganization || false,
      organizationName: isOrganization ? organizationName : null,

      // organização começa pendente
      status: isOrganization ? "pending" : "approved",
    });

    // gerar token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOrganization: user.isOrganization,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro no servidor",
    });
  }
};

// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // usuário
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Usuário não encontrado",
      });
    }

    // verificar senha
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Senha inválida",
      });
    }

    // token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOrganization: user.isOrganization,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro no servidor",
    });
  }
};