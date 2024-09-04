import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @ApiProperty({
    example: 'john_doe',
    description: 'The updated username of the user',
    required: false,
  })
  username?: string;

  @ApiProperty({
    example: 'john.doe@newdomain.com',
    description: 'The updated email of the user',
    required: false,
  })
  email?: string;
}
