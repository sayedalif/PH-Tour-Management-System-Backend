import { Server } from 'http';
import mongoose from 'mongoose';
import { app } from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

let myage;

const startServer = async () => {
  try {
    // console.log(envVars.NODE_ENV);
    await mongoose.connect(envVars.DB_URL);

    console.log('Database connected successfully');

    server = app.listen(envVars.PORT, () => {
      console.log('Server is running on port 5000');
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

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
