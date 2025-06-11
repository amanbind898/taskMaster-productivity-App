// models/Task.js
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    default: 'General'
  },
  dueDate: {
    type: Date,
    required: true
  },
  reminder: Date,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  order: Number // For drag-and-drop ordering
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
