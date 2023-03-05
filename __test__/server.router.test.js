import Router, {ERequestMethod} from "../src/server/router";
import * as http from "http";

describe('server - router', () => {
    it ('router', () => {
        const r = new Router();

        expect(r.server).toBeInstanceOf(http.Server);
        expect(r.middlewares).toHaveLength(0);

        expect(Object.values(r.routes).every((r) => r.length === 0)).toBeTruthy();
        expect(r.middlewares).toHaveLength(0);

        const get = jest.fn();
        const post = jest.fn();
        const remove = jest.fn();
        const update = jest.fn();
        const middleware = jest.fn((req, res, next) => next());

        r.get('/get', get);
        r.post('/get/post', post);
        r.delete('/get', remove);
        r.update('/get', update);
        r.use(middleware);

        expect(r.routes[ERequestMethod.GET]).toHaveLength(1);
        expect(r.routes[ERequestMethod.GET][0].path.test('/get')).toBeTruthy();
        expect(r.routes[ERequestMethod.GET][0].controller).toBe(get);
        expect(r.routes[ERequestMethod.POST][0].controller).toBe(post);
        expect(r.routes[ERequestMethod.DELETE][0].controller).toBe(remove);
        expect(r.routes[ERequestMethod.UPDATE][0].controller).toBe(update);
        expect(r.middlewares).toHaveLength(1);
        expect(r.middlewares[0]).toBe(middleware);

        r.get('/get/web', get);
        expect(r.routes[ERequestMethod.GET]).toHaveLength(2);

        expect(middleware).toHaveBeenCalledTimes(0);
        expect(get).toHaveBeenCalledTimes(0);
        expect(post).toHaveBeenCalledTimes(0);
        expect(update).toHaveBeenCalledTimes(0);
        expect(remove).toHaveBeenCalledTimes(0);

        let req = { path: '/get', method: ERequestMethod.GET };

        r.callHandlers(req, {});

        expect(middleware).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledTimes(1);
        expect(post).toHaveBeenCalledTimes(0);
        expect(update).toHaveBeenCalledTimes(0);
        expect(remove).toHaveBeenCalledTimes(0);

        req = { path: '/get/post', method: ERequestMethod.POST };

        r.callHandlers(req, {});
        expect(middleware).toHaveBeenCalledTimes(2);
        expect(get).toHaveBeenCalledTimes(1);
        expect(post).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenCalledTimes(0);
        expect(remove).toHaveBeenCalledTimes(0);
    });
});