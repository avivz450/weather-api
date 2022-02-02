import log from '@ajar/marker';
import app from './modules/app/app.js';

const { PORT = 3030, HOST = 'localhost' } = process.env;

(async () => {
    await app.listen(PORT as number, HOST as string);
    log.magenta(`api is live on`, ` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);
})().catch(console.log);
