import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'express-jwt';
import { Controller } from './interfaces/controller.interface';
import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';
import { OrdersController } from './controllers/orders.controller';
import { UsersController } from './controllers/users.controller';
import { globalErrorHandler } from './middleware/global-error.middleware';

dotenv.config();


class App {
  public app = express();

  constructor(controllers: Controller[]) {
    this.connectToTheDatabase();
    this.initMiddlewares();
    this.initControllers(controllers);
  }

  public listen(): void {
    const port = Number(process.env.PORT) || 3000;

    this.app.listen(port, () => {
      console.log(`Listening on port ${port}!`);
    });
  }

  private initControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(morgan('tiny'));
    this.app.use(cors());
    this.app.use(
      jwt({
        secret: process.env.JWT_SECRET || 'secret',
        algorithms: ['HS256'],
        isRevoked: (req, payload, done) => {
          payload.isAdmin ? done(null, false) : done(null, true);
        }
      })
        .unless({
          path: [
            '/api/users/login',
            '/api/users/register',

          ]
        })
    );
    this.app.use(globalErrorHandler);
  }

  private connectToTheDatabase() {
    mongoose.connect(process.env.MONGODB_CONNECT ?? '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
      .then(() => console.log('Database connection is ready'))
      .catch((err) => console.log(err));
  }
}


const app = new App([
  new ProductsController(),
  new CategoriesController(),
  new OrdersController(),
  new UsersController()
]);

app.listen();
