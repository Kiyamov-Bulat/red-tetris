import comment from './controllers/comment';
import like from './controllers/like';
import photo from './controllers/photo';
import post from './controllers/post';
import user from './controllers/user';
import auth from './middleware/auth';
import logger from './middleware/logger';
import setCORS from './middleware/setCORS';
import Router from './router';

const RESTART_DELAY = 1000;

const startApp = (): void => {
	try {
		const router = new Router();

		/** MIDDLEWARES **/
		router.use(setCORS);
		router.use(logger);
		router.use(auth);

		/** USER **/
		router.get('/user/(?<id>\\d+)', user.get);
		router.post('/signup', user.signup);
		router.post('/login', user.login);
		router.post('/activate/(?<token>.+)', user.activate);
		router.post('/toggleSendEmailAlerts', user.toggleSendEmailAlerts);
		router.post('/account', user.update);
		router.get('/reset', user.sendPasswordResetLink);
		router.post('/reset', user.resetPassword);

		/** PHOTO **/
		router.get('/photos/(?<ownerId>\\d+)/(?<photoId>\\d+)', photo.get);
		router.post('/photo', photo.create);
		router.delete('/photo', photo.remove);

		/** POST **/
		router.get('/post/(?<itemId>\\d+)', post.get);
		router.delete('/post/(?<itemId>\\d+)', post.remove);
		router.get('/post', post.getAll);

		/** LIKE **/
		router.post('/like', like.toggle);

		/** COMMENT **/
		router.post('/comment', comment.create);
		router.get('/comment', comment.getAll);

		router.listen(process.env.APP_PORT);
	} catch (e) {
		setTimeout(startApp, RESTART_DELAY);
	}
};

const main = (): void => {
	startApp();
};

main();
