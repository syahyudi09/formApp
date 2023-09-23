import dotenv from 'dotenv';
import mongoose from 'mongoose';

const env = dotenv.config().parsed;

const connection = () => {
  mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_NAME
  });

  const connect = mongoose.connection;
  connect.on('error', console.error.bind(console, 'Connection Error: '));
  connect.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

export default connection;
