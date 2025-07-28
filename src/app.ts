import express, { Request, Response } from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/v1', router);


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Tour Management System API');
});

export { app };
