const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // home number
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'resident'], required: true },
  homeNumber: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  profilePhoto: { type: String },
  familyMembers: { type: String },
  vehicleNumber: { type: String },
  occupation: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.updatedAt = new Date();
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 