import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    CountriesModule,
    ThrottlerModule.forRoot({
      limit: 3,
      ttl: 20000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
