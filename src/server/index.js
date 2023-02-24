import fs from 'fs';
import debug from 'debug';
import http from 'http';
import io from 'socket.io';

const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');

const initApp = (app, params, cb) => {
  const { host, port } = params;

  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html';

    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err);
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
  };

  app.on('request', handler);

  app.listen({ host, port }, () =>{
    loginfo(`tetris listen on ${params.url}`);
    cb();
  });
};

const initEngine = io => {
  io.on('connection', function(socket){
    loginfo("Socket connected: " + socket.id);
    socket.on('action', (action) => {
      if(action.type === 'server/ping'){
        socket.emit('action', {type: 'pong'});
      }
    });
  });
};

export function create(params) {
  return new Promise( (resolve, reject) => {
    const app = http.createServer();

    initApp(app, params, () => {
      const socket = new io.Server(app);

      const stop = (cb) => {
        socket.close();
        app.close( () => {
          app.unref();
        });
        loginfo(`Engine stopped.`);
        cb();
      };

      initEngine(socket);
      resolve({stop});
    });
  });
}
