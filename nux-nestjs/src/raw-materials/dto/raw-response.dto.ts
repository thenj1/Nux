export class RawMaterialResponseDto{
    id: number;
    name: string;
    cod: string;
    stock: number;
}

export class PaginatedResponse<Titem>{
    data: Titem[];
    meta:{
        pages: number;
        limit: number;
        total: number;
        totalPages: number
    }
}