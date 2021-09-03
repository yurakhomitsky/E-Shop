import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { CategoryModel } from '../models/category';

export class CategoriesController implements Controller {
  public path = '/categories';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { name, icon, color } = request.body;

    const category = new CategoryModel({
      name,
      icon,
      color
    });

    const savedCategory = await category.save();

    if (!savedCategory) {
      response.status(400).send('The category cannot be created!');
    } else {
      response.send(savedCategory);
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    try {
      const { name, icon, color } = request.body;
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        request.params.id,
        {
          name,
          icon,
          color
        },
        { new: true }
      ).orFail(new Error('Could not update category'));

      response.status(200).send(updatedCategory);
    } catch ({ message }) {
      response.status(400).json({ success: false, message });
    }

  }

  public async delete(request: Request, response: Response): Promise<void> {
    try {

      await CategoryModel.findByIdAndDelete(request.params.id).orFail(new Error('The category could not be deleted'));
      response.status(200).json({ success: true, message: 'The category has been deleted' });

    } catch ({ message }) {
      response.status(400).json({ success: false, message });
    }
  }

  public async findAll(request: Request, response: Response): Promise<void> {
    const categories = await CategoryModel.find();

    if (!categories) {
      response.status(500).json({ success: false });
    } else {
      response.status(200).send(categories);
    }
  };

  public async findById(request: Request, response: Response): Promise<void> {
    try {
      const category = await CategoryModel.findById(request.params.id).orFail(new Error('The category with the given Id was not found'));

      response.status(200).send(category);
    } catch ({ message }) {
      response.status(404).json({ success: false, message });
    }
  };

  private initRoutes(): void {
    this.router.get(this.path, this.findAll);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }
}
