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
			console.log('socket connection', socket.id);
			socket.on(GAME_SOCKET_EVENT.CREATE, gameController.create.bind(gameController, server, socket));
			socket.on(GAME_SOCKET_EVENT.CONNECT, gameController.connect.bind(gameController, server, socket));
			socket.on('disconnect', gameController.disconnect.bind(gameController, server, socket));
		});

		router.use(setCORS);
		router.use(logger);

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