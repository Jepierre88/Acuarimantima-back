import {authenticate, TokenService} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserCredentials,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {CustomUserService, Credentials} from '../services';


@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 5,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,

  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise< {token: string, user: Omit<User,'id'>}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);
    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {
      token: token,
      user: userProfile,
    };
  }


  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id','eliminate']
          }),
        },
      },
    })
    newUserRequest: Omit<NewUserRequest,'id , eliminate'>,
  ): Promise<User> {
      if (newUserRequest.password.length < 5) {
        throw new HttpErrors[400](`La contraseña debe tener una extensión mínima de 5 caracteres`)
      }
      newUserRequest.username= newUserRequest.username.trim()
      const password = await hash(newUserRequest.password, await genSalt());
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      await this.userRepository.userCredentials(savedUser.id).create({password});
      return savedUser;
  }

  @authenticate('jwt')
  @patch('users/{id}/changePassword')
  @response(204, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async changePassword(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {type: 'string'},
        },
      },
    })
    newPassword: string,
  ): Promise<UserCredentials> {
    const password = await hash(newPassword, await genSalt());
    await this.userRepository.userCredentials(id).delete();
    return this.userRepository.userCredentials(id).create({password});
  }

}
