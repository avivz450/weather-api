import app from './modules/app';

async function startApp() {
    try {
        await app.start();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

startApp();
