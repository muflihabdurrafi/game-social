import express from 'express'
import dotenv from 'dotenv'
import userRoute from './routes/userRoutes.js'
import loginRoute from './routes/loginRoute.js'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import helmet from 'helmet'

dotenv.config()

const app = express()

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.use(helmet())
app.use(cookieParser())

// Enable CORS with specific options
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Request rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)

app.use(express.json({limit: '1mb'}))

// Routes
app.use('/api/users', userRoute)
app.use('/api/auth', loginRoute)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong!"
    });
});

export default app