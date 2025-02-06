import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersGeneratorService {
  constructor(private readonly databaseService: DatabaseService) {}

  async generateUsers(batchSize: number = 1000, totalUsers: number = 1000000) {
    try {
      const users = [];
      for (let i = 0; i < totalUsers; i++) {
        users.push({
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          birth_date: faker.date.birthdate({ mode: 'age', min: 18, max: 65 }), // birth_date in YYYY-MM-DD format
          gender: faker.person.gender(),
          interests: faker.animal.petName(),
          city: faker.location.city(),
          password: faker.internet.password(),
        });

        // Insert users in batches to optimize performance
        if (users.length >= batchSize) {
          await this.insertUsers(users);
          users.length = 0; // Reset users array
        }
      }

      // Insert remaining users
      if (users.length > 0) {
        await this.insertUsers(users);
      }

      console.log(`${totalUsers} users generated successfully!`);
    } catch (error) {
      console.error('Error generating users:', error);
    }
  }

  private async insertUsers(users: any[]) {
    // Формируем запрос с параметризированными значениями
    const query = `
        INSERT INTO users (first_name, last_name, birth_date, gender, interests, city, password)
        VALUES
            ${users
              .map(
                (_, index) =>
                  `(${
                    '$' + (index * 7 + 1)
                  }, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`,
              )
              .join(', ')}
    `;

    // Собираем все значения для запроса
    const values = users.flatMap((user) => [
      user.first_name,
      user.last_name,
      user.birth_date,
      user.gender,
      user.interests,
      user.city,
      user.password,
    ]);

    try {
      // Use the databaseService to execute the write query
      await this.databaseService.writeQuery(query, values);
    } catch (err) {
      console.error('Error inserting users:', err);
      throw err;
    }
  }
}
