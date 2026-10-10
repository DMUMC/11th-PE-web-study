import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import { Book } from './entities/book.entity.js';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  private toBookResponse(book: Book): BookResponseDto {
    return {
      bookId: book.bookId,
      title: book.title,
      description: book.description,
      categoryName: book.category?.name ?? null,
      isAvailable: Boolean(book.isAvailable),
    };
  }

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findAll();

    return books.map((book) => this.toBookResponse(book));
  }

  async createBook(body: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.bookRepository.findCategoryById(
      body.categoryId,
    );

    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const book = await this.bookRepository.create(body, category);

    return this.toBookResponse(book);
  }

  async getCategory(categoryId: number): Promise<any> {
    return await this.bookRepository.findCategory(categoryId);
  }

  async createRental(body: Record<string, any>): Promise<string> {
    await this.bookRepository.createRental(body);
    return '도서 대여가 완료되었습니다!';
  }
}