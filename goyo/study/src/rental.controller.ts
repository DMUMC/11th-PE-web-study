import { Body, Controller, Post } from '@nestjs/common';
import { BookService } from './book.service.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createRental(
    @Body() body: Record<string, any>,
  ): Promise<string> {
    return await this.bookService.createRental(body);
  }
}