import rateLimit from "express-rate-limit";

const opcionesRateLimit = {
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: {
        success: false,
        msg: "Demasiadas Peticiones Desde Esta IP, Intente Más Tarde"
    }
};

const limiter = rateLimit(opcionesRateLimit);

export default limiter;
