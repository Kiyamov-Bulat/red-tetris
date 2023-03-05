import * as http from 'http';
import Request from './request';
import Response from './response';
import SelfPreservingPromise from "../../utils/selfPreservingPromise";
import RoueParams from "./routeParams";

export const ERequestMethod = {
	GET: 'GET',
	POST: 'POST',
	DELETE: 'DELETE',
	UPDATE: 'UPDATE',
};

class Router {
	routes;
	middlewares;
	server;
	hashBased;

	io;
	constructor() {
		this.routes = {
			[ERequestMethod.GET]: [],
			[ERequestMethod.POST]: [],
			[ERequestMethod.DELETE]: [],
			[ERequestMethod.UPDATE]: [],
		};
		this.middlewares = [];

		this.server = http.createServer(
			{ IncomingMessage: Request, ServerResponse: Response },
			async (req, res) => {
				await this.callHandlers(req, res);

				if (!res.isEnded()) {
					res.end();
				}
			},
		);
	}

	get(path, controller) {
		this.saveRoute(path, controller, ERequestMethod.GET);
	}

	post(path, controller) {
		this.saveRoute(path, controller, ERequestMethod.POST);
	}

	delete(path, controller) {
		this.saveRoute(path, controller, ERequestMethod.DELETE);
	}

	update(path, controller) {
		this.saveRoute(path, controller, ERequestMethod.UPDATE);
	}

	use(middleware) {
		this.middlewares.push(middleware);
	}

	listen(config, listener) {
		return this.server.listen(config, listener);
	}

	matchRoute(req) {
		return (this.routes[req.method] || []).find((route) =>
			route.path.test(req.path),
		);
	}

	async callMatchedController(req, res) {
		const route = this.matchRoute(req);

		if (!route) {
			return;
		}
		RoueParams.matchAllRouteParams(req.path, route.path);

		return route.controller(req, res);
	}

	callHandlers(req, res) {
		const selfPreservingAsyncResult = {};

		let firstHandler = () =>
			(selfPreservingAsyncResult.current = new SelfPreservingPromise(
				this.callMatchedController(req, res),
			));

		if (this.middlewares.length > 0) {
			for (let i = this.middlewares.length - 1; i >= 0; --i) {
				const mw = this.middlewares[i];

				firstHandler = ((next) => {
					mw(req, res, next);

					return selfPreservingAsyncResult.current;
				}).bind(null, firstHandler);
			}
		}
		return firstHandler();
	}

	saveRoute(path, controller, method) {
		this.routes[method].push({ path: new RegExp(path), controller });
	}
}

export default Router;
