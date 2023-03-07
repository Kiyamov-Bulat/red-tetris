const setCORS = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS',
    );
    void next();
};

export default setCORS;
