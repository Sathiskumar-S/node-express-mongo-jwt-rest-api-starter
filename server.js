// server.js (or index.js)

import dotenv from 'dotenv-safe';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

import initMongo from './config/mongo.js';
import routes from './app/routes/index.js';

dotenv.config();

const app = express();

// Needed to replicate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000);

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
  const { default: getExpeditiousCache } = await import('express-expeditious');
  const { default: expeditiousRedisEngine } = await import('expeditious-engine-redis');

  const cache = getExpeditiousCache({
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    engine: expeditiousRedisEngine({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    })
  });

  app.use(cache);
}

// for parsing json
app.use(bodyParser.json({ limit: '20mb' }));

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// i18n setup
i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  objectNotation: true
});
app.use(i18n.init);

// Init all other stuff
app.use(cors());
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', (await import('ejs')).renderFile);
app.set('view engine', 'html');

// Routes
app.use(routes);

// Init MongoDB
initMongo();

// Start server
app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`);
});

// Export for testing
export default app;
