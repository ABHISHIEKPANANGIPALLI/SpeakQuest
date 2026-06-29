const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // Speaking practice history
  history: [
    {
      transcript: {
        type: String,
      },

      aiReply: {
        type: String,
      },

      fluency: {
        type: Number,
      },

      confidence: {
        type: Number,
      },

      grammarMistakes: {
        type: Number,
      },

      fillers: {
        type: Number,
      },

      mistakes: {
        type: [String],
      },

      correctSentence: {
        type: String,
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);