const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', 
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Newsletter', NewsletterSchema);
