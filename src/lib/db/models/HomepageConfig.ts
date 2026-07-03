import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial {
    quote: string;
    author: string;
    role: string;
    company: string;
    isActive: boolean;
}

export interface IHomepageConfig extends Document {
    // Featured Products
    featuredProductIds: string[];
    featuredProductsCount: number;

    // Section Visibility & Order
    sections: {
        id: string;
        label: string;
        visible: boolean;
        order: number;
    }[];

    // Stats
    stats: {
        yearsExperience: number;
        satisfiedClients: number;
        partsAvailable: number;
        onTimeDelivery: number;
    };

    // Testimonials
    testimonials: ITestimonial[];

    // Hero
    heroTitle: string;
    heroSubtitle: string;

    updatedAt: Date;
    updatedBy: string;
}

const testimonialSchema = new Schema({
    quote: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { _id: true });

const sectionSchema = new Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, required: true }
}, { _id: false });

const homepageConfigSchema = new Schema({
    featuredProductIds: { type: [String], default: [] },
    featuredProductsCount: { type: Number, default: 8, min: 4, max: 12 },

    sections: { type: [sectionSchema], default: [] },

    stats: {
        yearsExperience: { type: Number, default: 15 },
        satisfiedClients: { type: Number, default: 500 },
        partsAvailable: { type: Number, default: 5000 },
        onTimeDelivery: { type: Number, default: 98 }
    },

    testimonials: { type: [testimonialSchema], default: [] },

    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },

    updatedBy: { type: String, default: '' }
}, {
    timestamps: true,
    collection: 'homepage_config'
});

// Ensure only one config document exists (singleton pattern)
homepageConfigSchema.statics.getConfig = async function () {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({
            sections: getDefaultSections(),
            testimonials: getDefaultTestimonials(),
            stats: {
                yearsExperience: 15,
                satisfiedClients: 500,
                partsAvailable: 5000,
                onTimeDelivery: 98
            }
        });
    }
    return config;
};

export function getDefaultSections() {
    return [
        { id: 'hero', label: 'Hero Banner', visible: true, order: 0 },
        { id: 'brands', label: 'Brand Strip', visible: true, order: 1 },
        { id: 'stats', label: 'Statistics', visible: true, order: 2 },
        { id: 'features', label: 'Features Grid', visible: true, order: 3 },
        { id: 'categories', label: 'Categories', visible: true, order: 4 },
        { id: 'featured_products', label: 'Featured Products', visible: true, order: 5 },
        { id: 'parts_console', label: 'Parts Intelligence Console', visible: true, order: 6 },
        { id: 'story', label: 'Company Story', visible: true, order: 7 },
        { id: 'testimonials', label: 'Testimonials', visible: true, order: 8 },
        { id: 'cta', label: 'Call to Action', visible: true, order: 9 },
        { id: 'articles', label: 'Featured Articles', visible: true, order: 10 },
        { id: 'faq', label: 'FAQ Section', visible: true, order: 11 }
    ];
}

export function getDefaultTestimonials(): ITestimonial[] {
    return [
        {
            quote: "Saudi Horizon provided exceptional service in sourcing hard-to-find parts for our heavy machinery fleet. Their delivery speed minimized our downtime significantly.",
            author: "Fahad Al-Otaibi",
            role: "Operations Director",
            company: "Al-Otaibi Construction",
            isActive: true
        },
        {
            quote: "The quality of the refurbished equipment we purchased was outstanding. It performs like new but at a fraction of the cost. Highly recommended partner.",
            author: "John Smith",
            role: "Fleet Manager",
            company: "Global Logistics Co.",
            isActive: true
        },
        {
            quote: "Their technical support team went above and beyond to help us identify the correct components for our vintage Caterpillar generators.",
            author: "Mohammed Asghar",
            role: "Chief Engineer",
            company: "Power Systems Ltd.",
            isActive: true
        }
    ];
}

const HomepageConfig = mongoose.models.HomepageConfig || mongoose.model<IHomepageConfig>('HomepageConfig', homepageConfigSchema);
export default HomepageConfig;
