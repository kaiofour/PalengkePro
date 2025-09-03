import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
    // Registration logic here
    res.send('register');
});

router.post('/login', (req, res) => {
    // Registration logic here
    res.send('User registered');
});

export default router;