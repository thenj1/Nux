import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-config/prisma.service';

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

@Injectable()
export class ProductionService {
    constructor(private prisma: PrismaService) { }

    async calculateProductionSuggestion(): Promise<ProductionSummary> {
        const products = await this.prisma.product.findMany({
            include: {
                materials: {
                    include: {
                        rawMaterial: true
                    }
                }
            },
            orderBy: {
                price: 'desc'
            }
        });

        const rawMaterials = await this.prisma.rawMaterial.findMany();

        const availableStock = new Map<number, number>();
        rawMaterials.forEach(rm => {
            availableStock.set(rm.id, rm.stock);
        });

        const suggestions: ProductionSuggestion[] = [];
        let totalValue = 0;

        for (const product of products) {
            if (product.materials.length === 0) {
                continue;
            }

            let maxProducible = Infinity;

            for (const material of product.materials) {
                const available = availableStock.get(material.rawMaterialId) || 0;
                const needed = material.quantity;
                const possibleUnits = Math.floor(available / needed);
                maxProducible = Math.min(maxProducible, possibleUnits);
            }

            if (maxProducible > 0 && maxProducible !== Infinity) {
                suggestions.push({
                    productId: product.id,
                    productName: product.name,
                    productCode: product.cod,
                    productPrice: product.price,
                    quantity: maxProducible
                });

                totalValue += product.price * maxProducible;

                for (const material of product.materials) {
                    const currentStock = availableStock.get(material.rawMaterialId) || 0;
                    const usedStock = material.quantity * maxProducible;
                    availableStock.set(material.rawMaterialId, currentStock - usedStock);
                }
            }
        }

        return {
            suggestions,
            totalValue
        };
    }
}
