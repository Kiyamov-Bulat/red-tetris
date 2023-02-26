import io from "socket.io";
import Router from "./router";
import mainController from './controllers/main';
import gameController from './controllers/game';
import setCORS from "./middlewares/setCors";
import logger from "./middlewares/logger";
import {GAME_SOCKET_EVENT} from "../utils/constants";

const RESTART_DELAY = 1000;

const startApp = (config) => {
	try {
		const router = new Router();
		const server = new io.Server(router.server);

		server.on('connection', (socket) => {
			socket.on('disconnect', gameController.disconnect.bind(io, socket));
		});

		router.use(setCORS);
		router.use(logger);

		router.post('/create', gameController.create);
		router.post('/connect', gameController.connect);
		router.get('/list', gameController.getAll);

		router.get('/bundle\\.js', mainController.getBundle);
		router.get('/*\\.css', mainController.getStyles);
		router.get('/*', mainController.getIndex);
		router.listen(config);
	} catch (e) {
		setTimeout(startApp, RESTART_DELAY);
	}
};

export default startApp;