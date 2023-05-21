const defaultMiddleware = (req, res, next) => {
    res.append("X-Frame-Options", "DENY");
    res.append("X-Content-Type-Options", "nosniff");
    res.append(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );
    next();
};

export default defaultMiddleware;
