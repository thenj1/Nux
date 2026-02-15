import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        pages: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface Product {
    id: number;
    name: string;
    cod: string;
    price: number;
}

export interface RawMaterial {
    id: number;
    name: string;
    cod: string;
    stock: number;
}

export interface ProductMaterial {
    id: number;
    quantity: number;
    productId: number;
    rawMaterialId: number;
    product: Product;
    rawMaterial: RawMaterial;
}

export interface ProductionSuggestion {
    productId: number;
    productName: string;
    productCode: string;
    productPrice: number;
    quantity: number;
}

export interface ProductionSummary {
    suggestions: ProductionSuggestion[];
    totalValue: number;
}

export async function getProducts(page = 1, limit = 20, sort: 'asc' | 'desc' = 'desc') {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
        params: { page, limit, sort },
    });
    return response.data;
}

export async function searchProductsByName(name: string, page = 1, limit = 20, sort: 'asc' | 'desc' = 'desc') {
    const response = await api.get<PaginatedResponse<Product>>('/products/find/name', {
        params: { name, page, limit, sort },
    });
    return response.data;
}

export async function createProduct(data: { name: string; cod: string; price: number }) {
    const response = await api.post<Product>('/products/create', data);
    return response.data;
}

export async function updateProduct(id: number, data: { name?: string; cod?: string; price?: number }) {
    const response = await api.put<Product>(`/products/update/${id}`, data);
    return response.data;
}

export async function deleteProduct(id: number) {
    const response = await api.delete<{ message: string }>(`/products/delete/${id}`);
    return response.data;
}

export async function getRawMaterials(page = 1, limit = 20, sort: 'asc' | 'desc' = 'desc') {
    const response = await api.get<PaginatedResponse<RawMaterial>>('/raw-materials', {
        params: { page, limit, sort },
    });
    return response.data;
}

export async function searchRawMaterialsByName(name: string, page = 1, limit = 20, sort: 'asc' | 'desc' = 'desc') {
    const response = await api.get<PaginatedResponse<RawMaterial>>('/raw-materials/find/name', {
        params: { name, page, limit, sort },
    });
    return response.data;
}

export async function createRawMaterial(data: { name: string; cod: string; stock: number }) {
    const response = await api.post<RawMaterial>('/raw-materials/create', data);
    return response.data;
}

export async function updateRawMaterial(id: number, data: { name?: string; cod?: string; stock?: number }) {
    const response = await api.put<RawMaterial>(`/raw-materials/update/${id}`, data);
    return response.data;
}

export async function deleteRawMaterial(id: number) {
    const response = await api.delete<{ message: string }>(`/raw-materials/delete/${id}`);
    return response.data;
}

export async function getProductMaterials(productId: number) {
    const response = await api.get<ProductMaterial[]>(`/product-materials/product/${productId}`);
    return response.data;
}

export async function createProductMaterial(data: { productId: number; rawMaterialId: number; quantity: number }) {
    const response = await api.post<ProductMaterial>('/product-materials/create', data);
    return response.data;
}

export async function updateProductMaterial(id: number, data: { quantity: number }) {
    const response = await api.put<ProductMaterial>(`/product-materials/update/${id}`, data);
    return response.data;
}

export async function deleteProductMaterial(id: number) {
    const response = await api.delete<{ message: string }>(`/product-materials/delete/${id}`);
    return response.data;
}

export async function getProductionSuggestion() {
    const response = await api.get<ProductionSummary>('/production/suggestion');
    return response.data;
}
