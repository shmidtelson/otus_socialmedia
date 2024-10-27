import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from './dto/create-user.dto';
import { PG_CONNECTION } from '../database/database.providers';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private dbPool: Pool) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const {
      firstName,
      lastName,
      birthDate,
      gender,
      interests,
      city,
      password,
    } = createUserDto;
    const interestsString = interests?.join(',') || null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (first_name, last_name, birth_date, gender, interests, city, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, first_name, last_name, birth_date, gender, interests, city;
    `;

    const values = [
      firstName,
      lastName,
      birthDate,
      gender,
      interestsString,
      city,
      hashedPassword,
    ];
    const client = await this.dbPool.connect();
    try {
      const result = await client.query(query, values);
      return result.rows[0]; // Return the newly created user
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<UserDto> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const client = await this.dbPool.connect();
    try {
      const result = await client.query(query, [id]);

      return {
        id: result.rows[0].id,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        birthDate: result.rows[0].birth_date.toISOString().split('T')[0],
        gender: result.rows[0].gender,
        interests: result.rows[0].interests,
        city: result.rows[0].city,
        password: result.rows[0].password,
      };
    } finally {
      client.release();
    }
  }
}
