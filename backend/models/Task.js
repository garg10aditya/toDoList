const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  bgColor: {
    type: String,
    default: "#ffffff" // Default white
  },
 


  dueDate: Date,
  details: String,
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
