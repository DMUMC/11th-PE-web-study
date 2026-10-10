import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Injectable()
export class BookRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly pool: Pool,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });
  }

  async findCategoryById(categoryId: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: {
        categoryId: String(categoryId),
      },
    });
  }

  async create(body: CreateBookDto, category: Category): Promise<Book> {
    const book = this.bookRepository.create({
      categoryId: category.categoryId,
      category,
      title: body.title,
      description: body.description,
      isAvailable: true,
    });

    return await this.bookRepository.save(book);
  }

  async findCategory(categoryId: number): Promise<any> {
    const sql = 'SELECT * FROM book WHERE category_id = ?';

    const [rows] = await this.pool.execute(sql, [categoryId]);

    return rows;
  }

  async createRental(body: Record<string, any>): Promise<any> {
    const sql = `
      INSERT INTO rental (user_id, book_id, rented_at, due_at)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;

    const [result] = await this.pool.execute(sql, [
      body.userId,
      body.bookId,
    ]);

    return result;
  }
}