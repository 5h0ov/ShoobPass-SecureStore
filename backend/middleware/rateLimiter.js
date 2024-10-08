const rateLimiters = {};

const rateLimiter =  (options) => {
  const { windowMs, max, message } = options;
  
  return (req, res, next) => {

    const ip = req.ip;
    if (!rateLimiters[ip]) {
      rateLimiters[ip] = { count: 1, firstRequestTime: Date.now() };
    } else {
      rateLimiters[ip].count += 1;
    }

    const currentTime = Date.now();
    const timePassed = currentTime - rateLimiters[ip].firstRequestTime;

    if (timePassed > windowMs) {
      rateLimiters[ip] = { count: 1, firstRequestTime: currentTime };
    }

    if (rateLimiters[ip].count > max) {
      const timeLeft = Math.ceil((windowMs - timePassed) / 1000); // time left in seconds
      const timeLeftMessage = `Too many requests from this IP, please try again after ${timeLeft} seconds.`;
      return res.status(420).json({ success: false, message: timeLeftMessage });
    }

    next();
  };
};

export const savePasswordLimiter = rateLimiter({
  windowMs: 0.5 * 60 * 1000, // 30 seconds
  max: 5, // Limit each IP to 5 save requests per `window` (here, per 30 seconds)
  message: '',
});

export const retrievePasswordLimiter = rateLimiter({
  windowMs: 0.5 * 60 * 1000, // 30 seconds
  max: 5, // Limit each IP to 5 retrieve requests per `window` (here, per 30 seconds)
  message: '',
});