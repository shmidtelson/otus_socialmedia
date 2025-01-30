import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { DatabaseService } from '../database/database.service';

type SearchParams = {
  first_name: string;
  last_name: string;
};

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

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

    try {
      // Use the databaseService to execute the write query
      await this.databaseService.writeQuery(query, values);
    } catch (err) {
      console.error('Error inserting users:', err);
      throw err;
    }
  }

  async findById(id: string): Promise<UserDto> {
    const query = `SELECT * FROM users WHERE id = $1`;

    const result = await this.databaseService.readQuery(query, [id]);
    return {
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      birthDate: result.rows[0].birth_date
        ? result.rows[0].birth_date.toISOString().split('T')[0]
        : null,
      gender: result.rows[0].gender,
      interests: result.rows[0].interests,
      city: result.rows[0].city,
      password: result.rows[0].password,
    };
  }

  async search({ first_name, last_name }: SearchParams): Promise<UserDto[]> {
    const query = `SELECT * FROM users WHERE first_name LIKE $1 and last_name LIKE $2 ORDER BY id LIMIT 10`;

    try {
      // Ensure wildcards are added for partial search.
      const searchFirstName = `${first_name}%`;
      const searchLastName = `${last_name}%`;

      const result = await this.databaseService.readQuery(query, [
        searchFirstName,
        searchLastName,
      ]);

      // Map results to the desired format
      return result.rows.map((row: any) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        birthDate: row.birth_date
          ? row.birth_date.toISOString().split('T')[0]
          : null,
        gender: row.gender,
        interests: row.interests,
        city: row.city,
        password: row.password,
      }));
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('An error occurred while searching for users');
    }
  }
}
