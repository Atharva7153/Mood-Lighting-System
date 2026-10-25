const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
  r: { type: Number, required: true },
  g: { type: Number, required: true },
  b: { type: Number, required: true }
}, { _id: false });

const MoodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  singleColor: { type: ColorSchema, required: true },
  multiColors: { type: [ColorSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Mood', MoodSchema);
