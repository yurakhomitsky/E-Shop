import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { Order } from '../models/order';


export class OrdersController implements Controller {
  public path = '/orders';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public async findAll(request: Request, response: Response) {
    const orders = await Order.find();

    if (!orders) {
      response.status(500).json({ success: false });
    } else {
      response.send(orders);
    }
  };

  private initRoutes(): void {
    this.router.get(this.path, this.findAll);
  }
}
