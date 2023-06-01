import express from 'express';
export const router = express.Router();
import {
    signin,
    signup,
    logout,
    loginPipe,
    registerPipe
} from './piplines.js';

const Api = await import('../api/api.js');


// routes

// testing
router.get('/test', Api.test);
