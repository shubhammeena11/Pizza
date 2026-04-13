import express, { urlencoded } from 'express';
import { APP_PORT } from './config/index.js';
import routes from './routes/index.js';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
import connectDB from './config/DB.js';
connectDB();

global.appRoot = path.resolve(__dirname);

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static(path.join(global.appRoot, 'uploads')));
app.use(urlencoded({ extended: false }));
app.use(errorHandler);
console.log('PORT VALUE:', APP_PORT);
app.listen(APP_PORT, () => console.log(`Server is running on port ${APP_PORT}`));

