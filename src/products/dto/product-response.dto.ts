export class ProductResponseDto{
   id: number;
   name: string;
   cod: string;
   price: number;
 }

export class PaginatedResponse<Titem>{
   data: Titem[];
   meta: {
      pages: number;
      limit: number;
      total: number;
      totalPages: number;
   }
}