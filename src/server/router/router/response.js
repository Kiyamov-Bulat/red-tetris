import * as http from 'http';
import HttpStatusCode from "./httpStatusCode";

class Response extends http.ServerResponse {
	_isEnded = false;

	isEnded() {
		return this._isEnded;
	}

	end(chunk, encoding, cb) {
		this._isEnded = true;
		return super.end(chunk, encoding, cb);
	}

	send(msg, statusCode = HttpStatusCode.OK, encoding) {
		this.statusCode = statusCode;
		this.end(msg, encoding);
	}

	sendJSON(body, statusCode = HttpStatusCode.OK) {
		this.setHeader('Content-Type', 'application/json');
		this.send(JSON.stringify(body), statusCode);
	}

	redirect(
		location,
		msg = 'Moved Permanently',
		statusCode = HttpStatusCode.PERMANENT_REDIRECT,
	) {
		this.setHeader('location', location);
		this.send(msg, statusCode);
	}

	error(
		msg = 'Internal Server Error',
		statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
	) {
		this.send(msg, statusCode);
	}
}

export default Response;
