import { EquipmentType, EquipmentBrand, EquipmentModel, Equipment } from './types';

export const equipmentData = {
  equipmentTypes: [
    {
      id: 'excavator',
      name: 'Excavator',
      icon: '🚜',
      systems: [
        'Engine',
        'Hydraulic',
        'Electrical',
        'Transmission',
        'Cooling System'
      ],
      brands: [
        {
          id: 'caterpillar',
          name: 'Caterpillar',
          models: [
            {
              id: 'cat-320d',
              name: '320D',
              yearRanges: ['2005-2010', '2010-2015', '2015-2018'],
              compatibilityId: 'cat-320d'
            },
            {
              id: 'cat-325d',
              name: '325D',
              yearRanges: ['2007-2012', '2012-2018'],
              compatibilityId: 'cat-325d'
            },
            {
              id: 'cat-330d',
              name: '330D',
              yearRanges: ['2008-2013', '2013-2018'],
              compatibilityId: 'cat-330d'
            },
            {
              id: 'cat-420',
              name: '420',
              yearRanges: ['2006-2011', '2011-2016'],
              compatibilityId: 'cat-420'
            },
            {
              id: 'cat-950',
              name: '950',
              yearRanges: ['2005-2010', '2010-2015'],
              compatibilityId: 'cat-950'
            },
            {
              id: 'cat-966',
              name: '966',
              yearRanges: ['2004-2009', '2009-2014'],
              compatibilityId: 'cat-966'
            }
          ]
        },
        {
          id: 'jcb',
          name: 'JCB',
          models: [
            {
              id: 'jcb-3cx',
              name: '3CX',
              yearRanges: ['2005-2010', '2010-2015', '2015-2020'],
              compatibilityId: 'jcb-3cx'
            },
            {
              id: 'jcb-456',
              name: '456',
              yearRanges: ['2006-2011', '2011-2016'],
              compatibilityId: 'jcb-456'
            },
            {
              id: 'jcb-4cx',
              name: '4CX',
              yearRanges: ['2007-2012', '2012-2017'],
              compatibilityId: 'jcb-4cx'
            }
          ]
        },
        {
          id: 'komatsu',
          name: 'Komatsu',
          models: [
            {
              id: 'kom-pc300',
              name: 'PC300',
              yearRanges: ['2005-2010', '2010-2015', '2015-2020'],
              compatibilityId: 'kom-pc300'
            },
            {
              id: 'kom-pc200',
              name: 'PC200',
              yearRanges: ['2006-2011', '2011-2016'],
              compatibilityId: 'kom-pc200'
            }
          ]
        }
      ]
    },
    {
      id: 'loader',
      name: 'Loader',
      icon: '🚛',
      systems: ['Engine', 'Transmission', 'Hydraulic', 'Electrical'],
      brands: [
        {
          id: 'volvo',
          name: 'Volvo',
          models: [
            {
              id: 'volvo-l90',
              name: 'L90',
              yearRanges: ['2005-2010', '2010-2015'],
              compatibilityId: 'volvo-l90'
            }
          ]
        }
      ]
    },
    {
      id: 'dozer',
      name: 'Dozer',
      icon: '🚚',
      systems: ['Engine', 'Track System', 'Hydraulic', 'Electrical'],
      brands: [
        {
          id: 'caterpillar',
          name: 'Caterpillar',
          models: [
            {
              id: 'cat-d6',
              name: 'D6',
              yearRanges: ['2005-2010', '2010-2015'],
              compatibilityId: 'cat-d6'
            }
          ]
        }
      ]
    }
  ]
};

export const getEquipmentHierarchy = (data: any = equipmentData) => {
  return data.equipmentTypes;
};

export const searchEquipment = (query: string, data: any = equipmentData) => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const results: Equipment[] = [];

  data.equipmentTypes.forEach((type: any) => {
    type.brands.forEach((brand: any) => {
      brand.models.forEach((model: any) => {
        const modelText = `${brand.name} ${model.name}`;
        const modelLower = modelText.toLowerCase();
        
        if (modelLower.includes(lowerQuery)) {
          results.push({
            id: model.compatibilityId,
            type: type.id,
            typeName: type.name,
            brand: brand.name,
            brandId: brand.id,
            model: model.name,
            modelId: model.id,
            yearRange: undefined,
            compatibilityId: model.compatibilityId
          });
        }

        model.yearRanges.forEach((yearRange: string) => {
          const yearText = `${modelText} (${yearRange})`;
          const yearLower = yearText.toLowerCase();
          
          if (yearLower.includes(lowerQuery)) {
            results.push({
              id: `${model.compatibilityId}-${yearRange}`,
              type: type.id,
              typeName: type.name,
              brand: brand.name,
              brandId: brand.id,
              model: model.name,
              modelId: model.id,
              yearRange: yearRange,
              compatibilityId: model.compatibilityId
            });
          }
        });
      });
    });
  });

  return results;
};

export const getEquipmentById = (id: string, data: any = equipmentData) => {
  const parts = id.split('-');
  const compatibilityId = parts[0];
  const yearRange = parts[1];

  let foundEquipment: Equipment | null = null;

  data.equipmentTypes.forEach((type: any) => {
    type.brands.forEach((brand: any) => {
      brand.models.forEach((model: any) => {
        if (model.compatibilityId === compatibilityId) {
          foundEquipment = {
            id: id,
            type: type.id,
            typeName: type.name,
            brand: brand.name,
            brandId: brand.id,
            model: model.name,
            modelId: model.id,
            yearRange: yearRange,
            compatibilityId: model.compatibilityId
          };
        }
      });
    });
  });

  return foundEquipment;
};

export const getCompatibleProducts = (equipmentId: string, products: any[]) => {
  const equipment = getEquipmentById(equipmentId);
  if (!equipment) return [];

  return products.filter((product: any) => 
    product.compatibility?.includes(equipment.compatibilityId) ||
    product.compatibility?.includes(equipmentId)
  );
};

export const getEquipmentTypes = (data: any = equipmentData) => {
  return data.equipmentTypes.map((type: any) => ({
    id: type.id,
    name: type.name,
    icon: type.icon
  }));
};

export const getBrandsByType = (typeId: string, data: any = equipmentData) => {
  const type = data.equipmentTypes.find((t: any) => t.id === typeId);
  return type?.brands || [];
};

export const getModelsByBrand = (typeId: string, brandId: string, data: any = equipmentData) => {
  const type = data.equipmentTypes.find((t: any) => t.id === typeId);
  if (!type) return [];
  
  const brand = type.brands.find((b: any) => b.id === brandId);
  return brand?.models || [];
};

export const getYearRangesByModel = (typeId: string, brandId: string, modelId: string, data: any = equipmentData) => {
  const type = data.equipmentTypes.find((t: any) => t.id === typeId);
  if (!type) return [];
  
  const brand = type.brands.find((b: any) => b.id === brandId);
  if (!brand) return [];
  
  const model = brand.models.find((m: any) => m.id === modelId);
  return model?.yearRanges || [];
};

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

export interface EquipmentType {
  id: string;
  name: string;
  icon: string;
  systems: string[];
  brands: EquipmentBrand[];
}

export interface EquipmentBrand {
  id: string;
  name: string;
  models: EquipmentModel[];
}

export interface EquipmentModel {
  id: string;
  name: string;
  yearRanges: string[];
  compatibilityId: string;
}
      brands: [
        {
          id: 'caterpillar',
          name: 'Caterpillar',
          models: [
            {
              id: 'cat-d6',
              name: 'D6',
              yearRanges: ['2005-2010', '2010-2015'],
              compatibilityId: 'cat-d6'
            }
          ]
        }
      ]
    }
  ]
};

export const getEquipmentHierarchy = (data: any = equipmentData) => {
  return data.equipmentTypes;
};

export const searchEquipment = (query: string, data: any = equipmentData) => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const results: Equipment[] = [];

  data.equipmentTypes.forEach((type: any) => {
    type.brands.forEach((brand: any) => {
      brand.models.forEach((model: any) => {
        const modelText = `${brand.name} ${model.name}`;
        const modelLower = modelText.toLowerCase();
        
        if (modelLower.includes(lowerQuery)) {
          results.push({
            id: model.compatibilityId,
            type: type.id,
            typeName: type.name,
            brand: brand.name,
            brandId: brand.id,
            model: model.name,
            modelId: model.id,
            yearRange: undefined,
            compatibilityId: model.compatibilityId
          });
        }

        model.yearRanges.forEach((yearRange: string) => {
          const yearText = `${modelText} (${yearRange})`;
          const yearLower = yearText.toLowerCase();
          
          if (yearLower.includes(lowerQuery)) {
            results.push({
              id: `${model.compatibilityId}-${yearRange}`,
              type: type.id,
              typeName: type.name,
              brand: brand.name,
              brandId: brand.id,
              model: model.name,
              modelId: model.id,
              yearRange: yearRange,
              compatibilityId: model.compatibilityId
            });
          }
        });
      });
    });
  });

  return results;
};

export const getEquipmentById = (id: string, data: any = equipmentData) => {
  const parts = id.split('-');
  const compatibilityId = parts[0];
  const yearRange = parts[1];

  let foundEquipment: Equipment | null = null;

  data.equipmentTypes.forEach((type: any) => {
    type.brands.forEach((brand: any) => {
      brand.models.forEach((model: any) => {
        if (model.compatibilityId === compatibilityId) {
          foundEquipment = {
            id: id,
            type: type.id,
            typeName: type.name,
            brand: brand.name,
            brandId: brand.id,
            model: model.name,
            modelId: model.id,
            yearRange: yearRange,
            compatibilityId: model.compatibilityId
          };
        }
      });
    });
  });

  return foundEquipment;
};

export const getCompatibleProducts = (equipmentId: string, products: any[]) => {
  const equipment = getEquipmentById(equipmentId);
  if (!equipment) return [];

  return products.filter((product: any) => 
    product.compatibility?.includes(equipment.compatibilityId) ||
    product.compatibility?.includes(equipmentId)
  );
};

export const getEquipmentTypes = (data: any = equipmentData) => {
  return data.equipmentTypes.map((type: any) => ({
    id: type.id,
    name: type.name,
    icon: type.icon
  }));
};

export const getBrandsByType = (typeId: string, data: any = equipmentData) => {
  const type = data.equipmentTypes.find((t: any) => t.id === typeId);
  return type?.brands || [];
};

export const getModelsByBrand = (typeId: string, brandId: string, data: any = equipmentData) => {
  const type = data.equipmentTypes.find((t: any) => t.id === typeId);
  if (!type) return [];
  
  const brand = type.brands.find((b: any) => b.id === brandId);
  return brand?.models || [];
};

export const getYearRangesByModel = (typeId: string, brandId: string, modelId: string, data: any = equipmentData) => {
  const type = data.equipmentTypes.find((t: any) => t.id === typeId);
  if (!type) return [];
  
  const brand = type.brands.find((b: any) => b.id === brandId);
  if (!brand) return [];
  
  const model = brand.models.find((m: any) => m.id === modelId);
  return model?.yearRanges || [];
};

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

export interface EquipmentType {
  id: string;
  name: string;
  icon: string;
  systems: string[];
  brands: EquipmentBrand[];
}

export interface EquipmentBrand {
  id: string;
  name: string;
  models: EquipmentModel[];
}

export interface EquipmentModel {
  id: string;
  name: string;
  yearRanges: string[];
  compatibilityId: string;
}
