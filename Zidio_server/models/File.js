import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  diskFileName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['excel', 'csv', 'pdf'],
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: [{
    type: mongoose.Schema.Types.Mixed
  }],
  rowCount: {
    type: Number,
    default: 0
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('File', fileSchema);