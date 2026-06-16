const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: true,
    },
    telefone: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: ['resgatador', 'doador'],
      default: 'resgatador',
    },
  },
  {
    timestamps: true, // Adiciona campos createdAt e updatedAt automaticamente
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
