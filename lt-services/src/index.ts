import mongoose from 'mongoose';
import express from 'express';
import * as C from './constants';

const app = express();

app.use(express.json());

mongoose.connect(C.MONGOURI).then(() => {
    console.log('Connected to Location Tracker DB.')
});

app.listen(C.PORT, () => {
    console.log(`Server running on PORT: ${C.PORT}`)
});
