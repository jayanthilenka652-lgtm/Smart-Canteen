const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

const root = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(root, '.env') });

const apiPort = Number(process.env.PORT || 5007);
const clientPort = Number(process.env.VITE_PORT || 5173);
const children = [];
let shuttingDown = false;

const request = (host, port, route) => new Promise((resolve, reject) => {
  const req = http.get({ hostname: host, family: host === '::1' ? 6 : 4, port, path: route, timeout: 1500 }, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => resolve({ status: res.statusCode, body }));
  });
  req.on('timeout', () => req.destroy(new Error('Request timed out')));
  req.on('error', reject);
});

const isPortAvailable = (port) => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', error => error.code === 'EADDRINUSE' ? resolve(false) : reject(error));
  server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
});

const startProcess = (command, args, cwd) => {
  const child = spawn(process.execPath, [command, ...args], {
    cwd,
    env: process.env,
    stdio: 'inherit'
  });
  children.push(child);
  return child;
};

const waitFor = async (label, port, route, isReady, child, timeoutMs = 60000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null) throw new Error(`${label} exited before becoming ready.`);
    try {
      const responses = await Promise.allSettled([
        request('127.0.0.1', port, route),
        request('::1', port, route)
      ]);
      if (responses.some(result => result.status === 'fulfilled' && isReady(result.value))) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 400));
  }
  throw new Error(`${label} did not become ready on port ${port}.`);
};

const ensureService = async ({ label, port, route, isReady, command, args, cwd }) => {
  const results = await Promise.allSettled([
    request('127.0.0.1', port, route),
    request('::1', port, route)
  ]);
  const responses = results.filter(result => result.status === 'fulfilled').map(result => result.value);
  const errors = results.filter(result => result.status === 'rejected').map(result => result.reason);

  if (responses.some(isReady)) {
    console.log(`[dev] Reusing ${label} on http://localhost:${port}`);
    return;
  }
  if (responses.length || errors.some(error => error.code !== 'ECONNREFUSED') || !(await isPortAvailable(port))) {
    throw new Error(`Port ${port} is occupied by a non-${label} service. Stop that process before starting the project.`);
  }

  console.log(`[dev] Starting ${label} on port ${port}`);
  const child = startProcess(command, args, cwd);
  await waitFor(label, port, route, isReady, child);
};

const stopChildren = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
};

process.on('SIGINT', () => { stopChildren(); });
process.on('SIGTERM', () => { stopChildren(); });

const main = async () => {
  try {
    await ensureService({
      label: 'backend API',
      port: apiPort,
      route: '/api/health',
      isReady: response => {
        if (response.status !== 200) return false;
        try {
          const health = JSON.parse(response.body);
          return health.status === 'OK' && health.database === 'MongoDB Atlas';
        } catch {
          return false;
        }
      },
      command: path.join(root, 'node_modules', 'nodemon', 'bin', 'nodemon.js'),
      args: ['server/server.js'],
      cwd: root
    });

    await ensureService({
      label: 'Vite frontend',
      port: clientPort,
      route: '/',
      isReady: response => response.status === 200 && response.body.includes('/@vite/client'),
      command: path.join(root, 'client', 'node_modules', 'vite', 'bin', 'vite.js'),
      args: ['--host', '0.0.0.0', '--port', String(clientPort), '--strictPort'],
      cwd: path.join(root, 'client')
    });

    console.log(`[dev] Smart Canteen: http://localhost:${clientPort}`);
    if (children.length) {
      for (const child of children) {
        child.once('exit', code => {
          if (!shuttingDown && code !== 0) {
            console.error('[dev] A development service stopped unexpectedly.');
            stopChildren();
            process.exitCode = 1;
          }
        });
      }
    }
  } catch (error) {
    console.error(`[dev] ${error.message}`);
    stopChildren();
    process.exitCode = 1;
  }
};

main();