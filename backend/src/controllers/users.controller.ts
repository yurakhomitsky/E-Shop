import express, { Request, Response } from 'express';
import { hash, genSalt, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Controller } from '../interfaces/controller.interface';
import { UserModel } from '../models/user';


export class UsersController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { name, email, password, phone, isAdmin, apartment, zip, city, country, street } = request.body;
    const salt = await genSalt();

    try {
      const user = new UserModel({
        name,
        email,
        password: await this.hashPassword(password, salt),
        phone,
        isAdmin,
        apartment,
        street,
        zip,
        city,
        country
      });
      const savedUser = await user.save();

      response.send(savedUser);
    } catch (error) {
      console.log(error);
      response.status(400).send({ success: false, error, message: 'The user cannot be created' });
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    try {
      const { name, email, password, phone, isAdmin, apartment, zip, city, country, street } = request.body;
      const salt = await genSalt();

      const updatedUser = await UserModel.findByIdAndUpdate(
        request.params.id,
        {
          name,
          email,
          // if we passsed the password then update it, otherwise omit
          ...(password && { password: await this.hashPassword(password, salt) }),
          phone,
          isAdmin,
          apartment,
          street,
          zip,
          city,
          country
        },
        { new: true }
      ).orFail(new Error('Could not update user'));

      response.status(200).send(updatedUser);
    } catch ({ message }) {
      response.status(400).json({ success: false, message });
    }
  }

  public async signIn(request: Request, response: Response) {
    try {
      const user = await UserModel.findOne({ email: request.body.email }).orFail(new Error('The user not found'));

      if (compareSync(request.body.password, user.password)) {
        const token = sign({
          userId: user.id
        },
          process.env.JWT_SECRET as string,
          {
            expiresIn: '1d'
          }
        );

        response.status(200).send({ user: user.email, token });

      } else {
        throw new Error('Password is wrong');
      }
    } catch ({ message }) {
      response.status(400).json({ success: false, message });
    }
  }

  public async findAll(request: Request, response: Response) {
    const users = await UserModel.find().select('-password');

    if (!users) {
      response.status(500).json({ success: false });
    } else {
      response.send(users);
    }
  };

  public async findById(request: Request, response: Response): Promise<void> {
    try {
      const user = await UserModel.findById(request.params.id).select('-password').orFail(new Error('The user with the given Id was not found'));

      response.status(200).send(user);
    } catch ({ message }) {
      response.status(404).json({ success: false, message });
    }
  };

  public hashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }

  private initRoutes(): void {
    this.router.get(this.path, this.findAll);
    this.router.get(`${this.path}/:id`, this.findById);
    this.router.post(this.path, this.create.bind(this));
    this.router.put(`${this.path}/:id`, this.update.bind(this));
    this.router.post(`${this.path}/login`, this.signIn.bind(this));
  }
}
