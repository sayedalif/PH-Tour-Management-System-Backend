import { Server } from 'http';
import mongoose from 'mongoose';
import { app } from './app';

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://tourmanagement:079JkMioHB6bgUii@cluster0.2ldxyj7.mongodb.net/tour-management?retryWrites=true&w=majority&appName=Cluster0'
    );

    console.log('Database connected successfully');

    server = app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on('SIGTERM', () => {
  console.log('Sigterm detected... server shutting down');

  if (server) {
    server.close(() => {
      console.log('Process terminated');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT detected... server shutting down');

  if (server) {
    server.close(() => {
      console.log('Process terminated');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('unhandledRejection', error => {
  console.log('Unhandled Rejection, shutting down server', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', error => {
  console.log('Uncaught Exception, shutting down server', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Promise.reject(new Error('Unhandled Rejection!'));

// throw new Error('Uncaught Exception!');

/**
 * unhandled rejection error - promise rejection
 * uncaught rejection error - console logging something that does not exist
 * sigterm - signal termination
 */
