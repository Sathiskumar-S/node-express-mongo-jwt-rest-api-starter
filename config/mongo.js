// config/mongo.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import loadModels from '../app/models/index.js';

dotenv.config();

const DB_URL = process.env.MONGO_URI;

export default function connectDB() {
  const connect = async () => {
    try {
      await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });


      if (process.env.NODE_ENV !== 'test') {
        console.log('****************************');
        console.log('*    Starting Server');
        console.log(`*    Port: ${process.env.PORT || 3000}`);
        console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`*    Database: MongoDB`);
        console.log(`*    DB Connection: OK`);
        console.log('****************************');
      }
    } catch (err) {
      console.error('****************************');
      console.error('*    Error connecting to DB:', err);
      console.error('****************************');
    }
  };

  connect();

  mongoose.connection.on('error', (err) => {
    console.error('*    Mongoose Connection Error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('*    Mongoose disconnected. Reconnecting...');
    connect();
  });

  loadModels(); // load all models
}
