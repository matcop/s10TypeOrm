import { Controller, Get } from '@nestjs/common';
import { ValidRolex } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('La semilla de datos')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }
  
  
  
  @Get()
  // @Auth(ValidRolex.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }



}
