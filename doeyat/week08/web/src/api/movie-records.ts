import { request, write } from './account';
export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export interface Rating { ratingId: number; movieId: number; score: number; comment: string }
export const records = {
 favorites: () => request<Favorite[]>('/favorites'),
 favorite: (id: number) => request<{isFavorite:boolean}>(`/favorites/${id}`),
 add: (movieId:number) => write<Favorite>('/favorites','POST',{movieId}),
 remove: (id:number) => write<void>(`/favorites/${id}`,'DELETE'),
 ratings: (id:number) => request<Rating[]>(`/members/${id}/ratings`),
 save: (body:{movieId:number;score:number;comment:string}, id?:number) => write<Rating>(id ? `/ratings/${id}` : '/ratings',id ? 'PATCH' : 'POST',id ? { score: body.score, comment: body.comment } : body),
 deleteRating: (id:number) => write<void>(`/ratings/${id}`,'DELETE'),
};
