import 'dotenv/config';

import axios from 'axios';

export const baseURL = process.env.BACKEND_URL || 'http://localhost:3030'

export const clientServer = axios.create({
  baseURL: baseURL,
});

