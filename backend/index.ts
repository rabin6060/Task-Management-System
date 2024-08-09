import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';

import routes from './src/routes/v1';
import env from './src/config/env';
import logger from './src/config/logger';
import { connectToDB } from './src/config/dbConnect';
import deSerializeUser from './src/Middleware/deSerializeUser';
import { globalErrorHandler } from './src/Middleware/globalErrorHandler';
import CustomError from './src/utils/Error';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';

import { Server } from 'socket.io';

(async () => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.cors,
      methods: ['GET', 'POST'],
    },
  });
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors(env.cors ? { origin: env.cors, optionsSuccessStatus: 200 } : undefined));

  morgan.token('level', (req: Request, res: Response) => {
    const statusCode = res.statusCode;
    if (statusCode >= 500) {
      return '[ERROR]';
    } else if (statusCode >= 400) {
      return '[WARN]';
    } else {
      return '[INFO]';
    }
  });
  app.use(
    morgan(':date[iso] :level :method :url :status :res[content-length] :referrer :total-time[5] - :response-time ms'),
  );

  app.use(deSerializeUser);
  //Add your route path prefix
  app.use('/api/v1', routes);

  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    console.log('Here');
    throw new CustomError(`Can't find path for ${req.originalUrl} on server!`, 404);
  });

  app.use(globalErrorHandler);
  io.on('connection', socket => {
    console.log('a user connected');
    socket.on('postComment', async(comment) => {
      console.log('receieve comment', comment);
      io.emit('newComment', comment);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(env.port, async () => {
    await connectToDB();
    console.log(`The application is listening on port \x1b[4m\x1b[31m${env.port}\x1b[0m`);
  });

  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(JSON.stringify({ message: `Unhandled Rejection at:, ${promise}`, error: reason }));
  });

  // Unhandled Exceptions
  process.on('uncaughtException', error => {
    logger.error(JSON.stringify({ message: `Uncaught Exception:, ${error}` }));
  });
})();
