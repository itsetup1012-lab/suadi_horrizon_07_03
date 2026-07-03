import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Eye, CheckCircle2, Circle, Star, ArrowRight, Package, Truck, FileText, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/api/products';
import { useComparison } from '@/contexts/ComparisonContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickInquiry: (product: Product) => void;
  index?: number;
  selectedEquipment?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickInquiry,
  index = 0,
  selectedEquipment,
}) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Comparison functionality
  const { comparisonProducts, addProduct, removeProduct, isFull } = useComparison();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isInComparison = comparisonProducts.includes(product._id);
  const inWishlist = isInWishlist(product._id);
  const canAddToComparison = !isFull || isInComparison;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <Card className="h-full border border-white/5 bg-surface/50 backdrop-blur-sm hover:border-gold/30 hover:bg-surface/80 transition-all duration-300 overflow-hidden flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
          <motion.img
            src={product.image || '/placeholder-image.png'}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-60" />

          {/* Quick Add Button - Always Visible at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy to-transparent">
            <Button
              className="w-full bg-gold hover:bg-yellow text-navy font-bold text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Quick Actions Overlay - Comparison & Wishlist on Hover */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between items-start">
              {/* Comparison Toggle */}
              <motion.button
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isInComparison
                  ? 'bg-gold border-gold text-navy'
                  : 'bg-black/30 border-white/20 text-white hover:bg-gold hover:border-gold hover:text-navy'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  isInComparison ? removeProduct(product._id) : addProduct(product._id);
                }}
                disabled={!canAddToComparison}
                aria-label={isInComparison ? 'Remove from compare' : 'Add to compare'}
              >
                {isInComparison ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </motion.button>

              {/* Wishlist Toggle */}
              <motion.button
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${inWishlist
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-black/30 border-white/20 text-white hover:bg-red-500 hover:border-red-500'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  inWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id);
                }}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Stock Badge */}
              {product.inStock && (
                <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">
                  In Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-5 space-y-4">
          {/* SKU / Part Number - Important for B2B */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Package className="w-3 h-3" />
            <span className="font-mono">SKU: {product.sku || 'N/A'}</span>
          </div>

          <div>
            <div className="text-xs font-bold text-gold/90 mb-1 uppercase tracking-wider font-display">
              {product.brand}
            </div>
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-gold transition-colors font-display line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Specs / Short Desc */}
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-end justify-between pt-2 border-t border-white/5">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Price</p>
              <div className="text-xl font-bold text-white font-display">
                ${product.price.toLocaleString()}
              </div>
              {/* Bulk pricing indicator */}
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Bulk pricing available
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span className="text-sm font-bold text-white">{product.rating}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
            <Truck className="w-3 h-3 text-gold" />
            <span>Free shipping on orders over $500</span>
          </div>
        </CardContent>

        {/* Footer Actions */}
        <div className="p-5 pt-0 mt-auto flex gap-3">
          <Button
            className="flex-1 border border-white/10 hover:bg-white/5 text-white bg-transparent group-hover:border-gold/30 transition-all font-display tracking-wide uppercase text-xs font-bold h-10"
            onClick={() => router.push(`/products/${product._id}`)}
          >
            Details <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Button>
          <Button
            variant="ghost"
            className="w-10 h-10 p-0 border border-white/10 hover:border-gold/30 hover:bg-gold/10 text-gold transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onQuickInquiry(product);
            }}
            title="Quick Inquiry"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
