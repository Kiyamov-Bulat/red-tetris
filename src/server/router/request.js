import * as http from 'http';

class Request extends http.IncomingMessage {
	_parsedURL;
	_params;
	_body;
	_userId = 0;

	get parsedURL() {
		if (!this._parsedURL) {
			this._parsedURL = new URL(this.url, `http://${this.headers.host}`); // @TODO
		}
		return this._parsedURL;
	}

	get params() {
		if (!this._params) {
			this._params = this.parsedURL?.searchParams;
		}
		return this._params;
	}

	getBody() {
		if (!this._body) {
			this._body = this.readBody();
		}
		return this._body;
	}

	async getJSONBody() {
		return JSON.parse((await this.getBody()).toString());
	}

	get URL() {
		return this.parsedURL;
	}


	get path() {
		return this.parsedURL?.pathname || '';
	}

	get hash() {
		return this.parsedURL?.hash || '';
	}


	async readBody() {
		const buffers = [];

		for await (const chunk of this) {
			buffers.push(chunk);
		}
		return Buffer.concat(buffers);
	}

	setUserId(id) {
		this._userId = Number(id);
	}

	getUserId() {
		return this._userId;
	}

	getUser() {
	}
}

export default Request;
