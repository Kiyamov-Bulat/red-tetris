const logger = (req, res, next) => {
    console.log(req.url, req.method, res.statusCode);
    void next();
};

export default logger;
