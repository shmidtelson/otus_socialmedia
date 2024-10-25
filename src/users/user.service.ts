import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from './dto/create-user.dto';
import { PG_CONNECTION } from '../database/database.providers';

@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private dbPool: Pool) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { firstName, lastName, birthDate, gender, interests, city } = createUserDto;
    const interestsString = interests?.join(',') || null;

    const query = `
      INSERT INTO users (first_name, last_name, birth_date, gender, interests, city)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, birth_date, gender, interests, city;
    `;

    const values = [firstName, lastName, birthDate, gender, interestsString, city];
    const client = await this.dbPool.connect();
    try {
      const result = await client.query(query, values);
      return result.rows[0];  // Return the newly created user
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<any> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const client = await this.dbPool.connect();
    try {
      const result = await client.query(query, [id]);
      return result.rows[0];  // Return the user by ID
    } finally {
      client.release();
    }
  }
}