import express, { Request, Response } from 'express';
import { Error, isValidObjectId } from 'mongoose';

import { Controller } from '../interfaces/controller.interface';
import { CategoryModel } from '../models/category';
import { ProductModel } from '../models/product';


export class ProductsController implements Controller {
  public path = '/products';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public async create(request: Request, response: Response) {
    const productBody = request.body;

    try {
      await CategoryModel.findById(productBody.category).orFail(new Error('Invalid Category'));

    } catch ({ message }) {
      return response.status(400).send({ message });
    }

    const product = new ProductModel({
      name: productBody.name,
      description: productBody.description,
      richDescription: productBody.richDescription,
      image: productBody.image,
      brand: productBody.brand,
      price: productBody.price,
      category: productBody.category,
      countInStock: productBody.countInStock,
      rating: productBody.rating,
      numOfReviews: productBody.numOfReviews,
      isFeatured: productBody.isFeatured
    });

    const savedProduct = await product.save();

    if (!savedProduct) {
      response.status(400).send('The product cannot be created!');
    } else {
      response.send(savedProduct);
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    try {
      if (!isValidObjectId(request.params.id)) {
        throw new Error('Object id is invalid');
      }

      const productBody = request.body;

      await CategoryModel.findById(productBody.category).orFail(new Error('Invalid Category'));

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        request.params.id,
        {
          name: productBody.name,
          description: productBody.description,
          richDescription: productBody.richDescription,
          image: productBody.image,
          brand: productBody.brand,
          price: productBody.price,
          category: productBody.category,
          countInStock: productBody.countInStock,
          rating: productBody.rating,
          numOfReviews: productBody.numOfReviews,
          isFeatured: productBody.isFeatured
        },
        { new: true }
      ).orFail(new Error('Could not update product'));

      response.status(200).send(updatedProduct);
    } catch ({ message }) {
      response.status(400).json({ success: false, message });
    }
  }

  public async delete(request: Request, response: Response): Promise<void> {
    try {

      if (!isValidObjectId(request.params.id)) {
        throw new Error('Object id is invalid');
      }

      await ProductModel.findByIdAndDelete(request.params.id).orFail(new Error('The product could not be deleted'));
      response.status(200).json({ success: true, message: 'The product has been deleted' });

    } catch ({ message }) {
      response.status(400).json({ success: false, message });
    }
  }

  public async findAll(request: Request, response: Response): Promise<void> {
    const products = await ProductModel.find().populate('category');

    if (!products) {
      response.status(500).json({ success: false });
    } else {
      response.send(products);
    }
  };

  public async findById(request: Request, response: Response): Promise<void> {
    try {

      if (!isValidObjectId(request.params.id)) {
        throw new Error('Object id is invalid');
      }

      const product = await ProductModel.findById(request.params.id).populate('category').orFail(new Error('The product with the given Id was not found'));

      response.status(200).send(product);
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
