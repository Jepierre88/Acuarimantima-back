// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {User, UserWithRelations} from '../models';
import {UserRepository} from '../repositories';
import {inject} from '@loopback/testlab';

/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */

const responsesUser = {
  userNotFound: 'Usuario no encontrado',
  unauthorized: 'Contraseña incorrecta',
  userDelete: 'El usuario ha sido eliminado',
  errorId: 'No se encuentra las credenciales para contraseña'
}

export type Credentials= {
  email: string;
  password: string;
}

export class CustomUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new HttpErrors.Unauthorized(responsesUser.userNotFound);
    }
    console.log(credentials)
    const foundUser = await this.userRepository.findOne({
      //where: {email: credentials.email},
      where: {
        or: [
          {username: credentials.email},
          {email: credentials.email},
        ]
      },
    });
    console.log(foundUser)
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(responsesUser.userNotFound);
    } else if (foundUser?.eliminate === true) {
      throw new HttpErrors.Unauthorized(responsesUser.userDelete);
    }
    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(responsesUser.errorId);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(responsesUser.unauthorized);
    }

    return foundUser;

  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      email: user.email,
      firstName:user.firstName,
      lastName:user.lastName,
      realm: user.realm
    };
  }

  //function to find user by id
  async findUserById(id: string): Promise<User & UserWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.userRepository.findOne({
      where: {id: id},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }
}
