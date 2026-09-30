import express from 'express';
import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

// Servírování statického frontendu ze složky public
app.use(express.static(join(__dirname, 'public')));

// Servírování skriptů Ultravioletu z node_modules
app.use('/uv/', express.static(join(__dirname, 'node_modules/@titaniumnetwork-dev/ultraviolet/dist')));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Ultraviolet běží na portu ${PORT}`);
});