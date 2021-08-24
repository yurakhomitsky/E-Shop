import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { Category } from '../models/category';

export class CategoriesController implements Controller {
  public path = '/categories';
  public router = express.Router();
  constructor() {
    this.initRoutes();
  }

  public async findAll(request: Request, response: Response) {
    const categories = await Category.find();

    if (!categories) {
      response.status(500).json({ success: false });
    } else {
      response.send(categories);
    }
  };

  private initRoutes(): void {
    this.router.get(this.path, this.findAll);
  }
}
