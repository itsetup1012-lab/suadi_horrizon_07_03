import { IProduct } from '@/types/product';

export interface Equipment {
    id: string;
    type: string;
    typeName: string;
    brand: string;
    brandId: string;
    model: string;
    modelId: string;
    yearRange?: string;
    compatibilityId: string;
}

/**
 * Search equipment by query string
 * Supports fuzzy matching for common abbreviations (e.g., "cat" for "caterpillar")
 */
export function searchEquipment(query: string, equipmentData: any): Equipment[] {
    const normalizedQuery = query.toLowerCase().trim();
    const results: Equipment[] = [];

    if (!normalizedQuery) return results;

    equipmentData.equipmentTypes?.forEach((type: any) => {
        type.brands?.forEach((brand: any) => {
            brand.models?.forEach((model: any) => {
                // Check if query matches type, brand, or model
                const typeMatch = type.name.toLowerCase().includes(normalizedQuery);
                const brandMatch = brand.name.toLowerCase().includes(normalizedQuery) ||
                    brand.id.toLowerCase().includes(normalizedQuery);
                const modelMatch = model.name.toLowerCase().includes(normalizedQuery);

                // Check for common abbreviations
                const catMatch = normalizedQuery.includes('cat') && brand.id === 'caterpillar';
                const komMatch = normalizedQuery.includes('kom') && brand.id === 'komatsu';

                if (typeMatch || brandMatch || modelMatch || catMatch || komMatch) {
                    model.yearRanges?.forEach((yearRange: string) => {
                        results.push({
                            id: `${model.compatibilityId}-${yearRange}`,
                            type: type.id,
                            typeName: type.name,
                            brand: brand.name,
                            brandId: brand.id,
                            model: model.name,
                            modelId: model.id,
                            yearRange,
                            compatibilityId: model.compatibilityId
                        });
                    });
                }
            });
        });
    });

    return results;
}

/**
 * Get equipment hierarchy (types -> brands -> models)
 */
export function getEquipmentHierarchy(equipmentData: any) {
    return equipmentData.equipmentTypes || [];
}

/**
 * Match products to equipment compatibility ID
 */
export function matchProductsToEquipment(
    products: IProduct[],
    compatibilityId: string
): IProduct[] {
    return products.filter(product =>
        product.compatibility?.includes(compatibilityId)
    );
}

/**
 * Generate display name for equipment
 */
export function getEquipmentDisplayName(equipment: Equipment): string {
    const parts = [equipment.brand, equipment.model];

    if (equipment.yearRange) {
        parts.push(`(${equipment.yearRange})`);
    }

    return parts.join(' ');
}

/**
 * Get equipment by compatibility ID
 */
export function getEquipmentByCompatibilityId(
    compatibilityId: string,
    equipmentData: any
): Equipment | null {
    for (const type of equipmentData.equipmentTypes || []) {
        for (const brand of type.brands || []) {
            for (const model of brand.models || []) {
                if (model.compatibilityId === compatibilityId) {
                    return {
                        id: model.compatibilityId,
                        type: type.id,
                        typeName: type.name,
                        brand: brand.name,
                        brandId: brand.id,
                        model: model.name,
                        modelId: model.id,
                        compatibilityId: model.compatibilityId
                    };
                }
            }
        }
    }
    return null;
}

/**
 * Get systems for equipment type
 */
export function getSystemsForEquipment(equipmentTypeId: string, equipmentData: any): string[] {
    const type = equipmentData.equipmentTypes?.find((t: any) => t.id === equipmentTypeId);
    return type?.systems || [];
}
