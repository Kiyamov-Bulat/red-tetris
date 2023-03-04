import params from '../../../params';

const jsonFetch =
(
	path,
	method = 'GET',
	options,
) => {
	return fetch(`${params.server.url}${path}`,
		{
			method,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
			body: options?.body && JSON.stringify(options?.body),
		}
	).then((resp) => {
		if (!resp.ok) {
			throw new Error('Something went wrong.');
		}

		const isJSON = resp.headers.get("content-type")?.includes("application/json");

		return isJSON ? resp.json() : resp.text();
	}).catch((err) => {
		if (options?.throwErr) {
			throw err;
		}
	});
};
export default jsonFetch;
