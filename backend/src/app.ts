import express from 'express';
import morgan from 'morgan';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from 'cors';
import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';
import { OrdersController } from './controllers/orders.controller';
import { UsersController } from './controllers/users.controller';

dotenv.config();


class App {
  public app = express();

  constructor() {
    this.initApp();
  }

  public initApp(): void {
    this.initMiddlewares();
    this.initControllers();
  }

  private initControllers(): void {
    this.app.get('/', (req, res) => {
      res.send('Hello API!');
    });
    this.app.use('/api', new ProductsController().router);
    this.app.use('/api', new CategoriesController().router);
    this.app.use('/api', new OrdersController().router);
    this.app.use('/api', new UsersController().router);

  }

  private initMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(morgan('tiny'));
    this.app.use(cors());
  }
}

mongoose.connect(process.env.MONGODB_CONNECT ?? '', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Database connection is ready'))
  .catch((err) => console.log(err));


function start(port: number) {
  const app = new App();

  app.app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
}


const port = Number(process.env.PORT) || 3000;
start(port);
