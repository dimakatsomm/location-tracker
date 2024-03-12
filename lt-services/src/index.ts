import 'reflect-metadata';
import mongoose from 'mongoose';
import express from 'express';
import * as C from './constants';
import authRouter from './routes/auth.route';
import locationRouter from './routes/location.route';
import { middleware } from 'express-openapi-validator';
import { serve, setup } from 'swagger-ui-express';
import { readFileSync } from 'fs';
import path from 'path';
import { loadAll } from 'js-yaml';

const app = express();

const apiSpec = readFileSync(path.join(__dirname, '../spec/api.spec.yaml'), 'utf-8');
const swaggerDoc = loadAll(apiSpec);

app.use(express.json());
app.use('/services', serve, setup(swaggerDoc));
app.use(middleware({ apiSpec, validateResponses: true, validateSecurity: true }));
app.use('/auth', authRouter);
app.use('/location', locationRouter);

mongoose.connect(C.MONGOURI).then(() => {
  console.log('Connected to Location Tracker DB.');
});

app.listen(C.PORT, () => {
  console.log(`Server running on PORT: ${C.PORT}`);
});
