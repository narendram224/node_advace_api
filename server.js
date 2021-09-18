import express from 'express';
import { NODE_ENV, PORT } from './src/config';
import logger from './src/Helper/logger';
import fs from 'fs';
import path from 'path';
import connectDatabase from './src/config/db'
import {auth, product} from './src/routes'
import { errorhandler } from './src/middleware';
import cookieParser from 'cookie-parser'
const morgan = require('morgan')
const app = express();
// uncatchException handle here
process.on('uncaughtException',err=>{
      logger.error(err.message);
      console.log("Shutting down the server due to uncatch exception");
      process.exit(1)
  })

app.use(express.json())
app.use(cookieParser())
// middleware for error handling
// connect the db
connectDatabase();

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' })

// Setup the logger
app.use(morgan('combined', { stream: accessLogStream },function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }))
  // setup routes

  app.use('/api/v1',product)
  app.use('/api/v1',auth)



  app.use(errorhandler)

// listing the port
const server = app.listen(PORT,()=>{
    logger.info(`Server started and running on port:${PORT} in ${NODE_ENV}`)
    
})

// Hanlde unhandle promise rejection
process.on('unhandledRejection',err=>{
  logger.error(err.message);
  console.log("Shutting down the server due to the unhandledRejection",err.message);
  server.close(()=>{
      process.exit(1);
  })
})