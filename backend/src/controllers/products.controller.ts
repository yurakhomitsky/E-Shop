import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { Product } from '../models/product';


export class ProductsController implements Controller {
  public path = '/products';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public async findAll(request: Request, response: Response) {
    const products = await Product.find();

    if (!products) {
      response.status(500).json({ success: false });
    } else {
      response.send(products);
    }
  };

  private initRoutes(): void {
    this.router.get(this.path, this.findAll);
  }
}
