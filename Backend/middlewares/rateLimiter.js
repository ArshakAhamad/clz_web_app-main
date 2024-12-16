import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 15 minutes
    max: 1,  // Limit each IP to 10 requests per windowMs
    message: 'Too many login attempts, please try again later'
});
