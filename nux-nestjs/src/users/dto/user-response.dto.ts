export class UserResponse {
    id: number;
    email: string;
    name: string;
}

export class PaginatedResponse<Titem> {
    data: Titem[];
    meta: {
        pages: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

export class LoginResponse {
    user: UserResponse;
    token: string;
}