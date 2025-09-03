//const express = require('express');
import express from 'express';
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000; // 3000: using hard coded value as fallback

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port ${PORT}');
});
 