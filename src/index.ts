import { AppDataSource } from './database/data-source';

async function startApp() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    // You can start your application logic here (e.g., start an Express server)
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }
}

startApp();