import fs from "fs";
import HttpStatusCode from "../router/router/httpStatusCode";

export default {
    async getBundle(req, res) {
        // @TODO
        const file = await fs.promises.readFile('./build/bundle.js');

        res.send(file, HttpStatusCode.OK, 'utf-8');
    },

    async getIndex(req, res) {
        // @TODO
        const file = await fs.promises.readFile('./build/index.html');

        res.send(file, HttpStatusCode.OK, 'utf-8');
    },

    async getStyles(req, res) {
        const file = await fs.promises.readFile(`./build/css/main.min.css`);

        res.send(file, HttpStatusCode.OK, 'utf-8');
    }
};