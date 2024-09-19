import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';

const app = express();



mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));
app.listen(3000, () => console.log('Server Started'));