import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { BookService } from './book.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { BookResponseDto } from './dto/book-response.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  @Post()
  async createBook(
    @Body() body: CreateBookDto,
  ): Promise<BookResponseDto> {
    return await this.bookService.createBook(body);
  }

  @Get('category/:categoryId')
  async findCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    return await this.bookService.getCategory(Number(categoryId));
  }
}