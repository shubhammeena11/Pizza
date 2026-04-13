import dotenv from 'dotenv';

dotenv.config();

export const {
    APP_PORT = 5000,
    DEBUG_MODE = 'true',
    DB_URL = 'mongodb://127.0.0.1:27017/erp',
    JWT_SECRET = 'default_jwt_secret',
    REFRESH_SECRET = 'default_refresh_secret',
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;