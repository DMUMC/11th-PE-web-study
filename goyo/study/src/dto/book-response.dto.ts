export class BookResponseDto {
  bookId: string;
  title: string;
  description: string;
  categoryName: string | null;
  isAvailable: boolean;
}