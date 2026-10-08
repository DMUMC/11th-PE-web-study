import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity.js';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id', type: 'bigint' })
  bookId: string;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: string;

  @Column({ name: 'title', type: 'varchar', length: 100 })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'is_available', type: 'tinyint'})
  isAvailable: boolean;

  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'categoryId' })
  category: Category;
}