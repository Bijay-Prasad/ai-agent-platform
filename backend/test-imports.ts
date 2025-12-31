import dotenv from 'dotenv';
dotenv.config();

console.log('Testing imports...');
console.log('✓ dotenv loaded');

import express from 'express';
console.log('✓ express loaded');

import mongoose from 'mongoose';
console.log('✓ mongoose loaded');

console.log('\n✅ All imports successful!');
console.log('\nEnvironment check:');
console.log('PORT:', process.env.PORT || 'not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ set' : '✗ not set');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ set' : '✗ not set');
