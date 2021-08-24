import express, { Request, Response } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { User } from '../models/user';

export class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public async findAll(request: Request, response: Response) {
    const users = await User.find();

    if (!users) {
      response.status(500).json({ success: false });
    } else {
      response.send(users);
    }
  };

  private initRoutes(): void {
    this.router.get(this.path, this.findAll);
  }
}
