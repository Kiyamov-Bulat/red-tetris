import params from "../params";
import setCors from "../src/server/middlewares/setCors";
import logger from "../src/server/middlewares/logger";

describe('server - middlewares', () => {
    it('CORS', () => {
        const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; } };
        const next = jest.fn();

        setCors({}, res, next);
        expect(res.headers['Access-Control-Allow-Origin']).toBe('*'); //params.server.url);
        expect(res.headers['Access-Control-Allow-Headers']).toBe(
            'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
        );
        expect(res.headers['Access-Control-Allow-Methods']).toBe(
            'PUT, POST, GET, DELETE, OPTIONS',
        );
        expect(next.mock.calls).toHaveLength(1);
        expect(next).toHaveBeenCalledWith();
    });
    
    it('logger', () => {
        console.log = jest.fn();
        const req = { url: 'foo', method: 'GET' };
        const res = { statusCode: 200 };
        const next = jest.fn();

        logger(req, res, next);
        // The first argument of the first call to the function was 'hello'
        expect(next.mock.calls).toHaveLength(1);
        expect(console.log).toHaveBeenCalledWith(req.url, req.method, res.statusCode);
        expect(console.log.mock.calls).toHaveLength(1);
    });
});