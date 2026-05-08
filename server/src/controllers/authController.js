const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    // criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // gerar token
    const token = jwt.sign(
      { id: user._id },
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
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor",
    });
  }
};

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
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor",
    });
  }
};