export class CreateUserDto {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  interests?: string[];
  city: string;
}
