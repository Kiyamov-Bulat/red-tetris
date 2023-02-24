import * as http from 'http';

class Request extends http.IncomingMessage {
	_parsedURL;
	_params;
	_body;
	_userId = 0;

	get parsedURL() {
		if (!this._parsedURL) {
			this._parsedURL = new URL(this.url, 'https://localhost'); // TODO
		}
		return this._parsedURL;
	}

	get params() {
		if (!this._params) {
			this._params = this._parsedURL.searchParams;
		}
		return this._params;
	}

	get body() {
		if (!this._body) {
			this._body = this.readBody();
		}
		return this._body;
	}

	async readBody() {
		const buffers = [];

		for await (const chunk of this) {
			buffers.push(chunk);
		}
		return Buffer.concat(buffers);
	}

	getPath() {
		return this.parsedURL?.pathname || '';
	}

	getParams() {
		return this.params;
	}

	getURL() {
		return this.parsedURL;
	}

	getBody() {
		return this.body;
	}

	async getJSONBody() {
		return JSON.parse((await this.getBody()).toString());
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
