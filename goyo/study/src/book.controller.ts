import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { BookService } from './book.service.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  @Post()
  async createBook(
    @Body() body: Record<string, any>,
  ): Promise<string> {
    return await this.bookService.createBook(body);
  }

  @Get('category/:categoryId')
  async findCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    return await this.bookService.getCategory(Number(categoryId));
  }
}