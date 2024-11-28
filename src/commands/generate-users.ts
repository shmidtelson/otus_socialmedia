import { Command, CommandRunner } from 'nest-commander';
import { UserService } from '../users/users-generator.service';

@Command({
  name: 'generate-users',
  arguments: '[task]',
  description: 'Generate users with a given task',
})
export class CommandTutorial extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    await this.userService.generateUsers();
  }
}