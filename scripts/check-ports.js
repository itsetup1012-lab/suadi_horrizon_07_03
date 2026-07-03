const net = require('net');

const targets = [
    { host: 'smtp.zoho.in', port: 465 },
    { host: 'smtp.zoho.in', port: 587 },
    { host: 'smtppro.zoho.com', port: 465 },
    { host: 'smtppro.zoho.in', port: 465 }
];

async function checkPort(host, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.on('connect', () => {
            console.log(`[OK] ${host}:${port} is reachable.`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`[TIMEOUT] ${host}:${port}`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.log(`[ERROR] ${host}:${port} - ${err.message}`);
            resolve(false);
        });

        socket.connect(port, host);
    });
}

async function run() {
    console.log('Checking SMTP reachability...');
    for (const target of targets) {
        await checkPort(target.host, target.port);
    }
}

run();
