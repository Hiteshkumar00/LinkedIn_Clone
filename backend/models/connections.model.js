import mongoose from 'mongoose';

const connectionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  stauts_accepted: {
    type: Boolean,
    default: null
  }
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionSchema);

export default ConnectionRequest;