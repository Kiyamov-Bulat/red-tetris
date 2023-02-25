import io from "socket.io";
import Router from "./router";
import mainController from './controllers/main';
import gameController from './controllers/game';
import setCORS from "./middlewares/setCors";
import logger from "./middlewares/logger";

const RESTART_DELAY = 1000;

const initEngine = io => {
	io.on('connection', function(socket){
		console.log("Socket connected: " + socket.id);
		socket.on('action', (action) => {
			if(action.type === 'server/ping'){
				socket.emit('action', {type: 'pong'});
			}
		});
	});
};

const startApp = (config) => {
	try {
		const router = new Router();

		router.use(setCORS);
		router.use(logger);

		router.post('/create', gameController.create);
		router.post('/connect', gameController.connect);
		router.post('/start', gameController.start);
		router.post('/restart', gameController.restart);
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