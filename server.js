import express from 'express';
import { APP_PORT } from './config/index.js';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(APP_PORT,()=> console.log(`Server is running on port ${APP_PORT}`));

