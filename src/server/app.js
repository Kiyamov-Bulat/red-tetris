import io from "socket.io";
import Router from "./router/router";
import mainController from './controllers/main';

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
		const socket = new io.Server(router.server);

		router.get('/bundle.js', mainController.getBundle);
		router.get('/*.css', mainController.getStyles);
		router.get('/*', mainController.getIndex);
		initEngine(socket);
		router.listen(config);
	} catch (e) {
		setTimeout(startApp, RESTART_DELAY);
	}
};

export default startApp;