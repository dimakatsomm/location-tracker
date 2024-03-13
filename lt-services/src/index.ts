import 'reflect-metadata';
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { loadAll } from 'js-yaml';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { middleware } from 'express-openapi-validator';
import * as C from './constants';
import authRouter from './routes/auth.route';
import locationRouter from './routes/location.route';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const app = express();

const apiSpec = readFileSync(path.join(__dirname, '../spec/api.spec.yaml'), 'utf-8');
const swaggerDoc = loadAll(apiSpec, null, { json: true })[0] as JsonObject;

app.use(express.json());
app.use('/services', serve, setup(swaggerDoc));
app.use(middleware({ apiSpec: swaggerDoc as OpenAPIV3.Document, validateSecurity: true }));
app.use('/auth', authRouter);
app.use('/locations', locationRouter);

mongoose.connect(C.MONGOURI).then(() => {
  console.log('Connected to Location Tracker DB.');
});

app.listen(C.PORT, () => {
  console.log(`Server running on PORT: ${C.PORT}`);
});
