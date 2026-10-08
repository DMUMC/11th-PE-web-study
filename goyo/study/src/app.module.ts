
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.provider.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';
import { RentalController } from './rental.controller.js';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'umc_library'),
        entities: [Book, Category],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Book, Category]),
  ],
  controllers: [
    AppController,
    BookController,
    RentalController,
  ],
  providers: [
    AppService,
    ...databaseProviders,
    BookService,
    BookRepository,
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
