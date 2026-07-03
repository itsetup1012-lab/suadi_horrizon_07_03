'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, MapPin, Calendar, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Machinery } from '@/api/machinery';

interface MachineryCardProps {
  machinery: Machinery;
  onQuickInquiry: (machinery: Machinery) => void;
  index?: number;
}

export const MachineryCard: React.FC<MachineryCardProps> = ({
  machinery,
  onQuickInquiry,
  index = 0,
}) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;

    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setMousePosition({ x: mouseXVal, y: mouseYVal });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Aligning badges with new color system but keeping semantic meaning
  const conditionColor: Record<string, string> = {
    New: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Used: 'bg-gold/10 text-gold border-gold/20',
    Refurbished: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      className="group relative perspective-1000"
    >
      {/* Magnetic effect overlay refined for new theme */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        animate={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(197, 160, 89, 0.15) 0%, transparent 60%)`
            : 'transparent',
        }}
      />

      <Card className="relative overflow-hidden border border-white/5 hover:border-gold/30 shadow-lg bg-surface/50 backdrop-blur-sm transition-all duration-300 h-full flex flex-col">

        {/* Image section */}
        <div className="relative overflow-hidden bg-white/5 h-48 border-b border-white/5">
          <motion.img
            src={machinery.image}
            alt={machinery.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-60" />

          {/* Condition badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 right-3"
          >
            <Badge className={`${conditionColor[machinery.condition] || 'bg-white/10 text-slate-300'} border backdrop-blur-md uppercase tracking-wider text-[10px] font-bold px-2 py-1`}>
              {machinery.condition}
            </Badge>
          </motion.div>

          <div className="absolute bottom-3 left-3 text-xs font-bold font-display text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-sm border border-white/10">
            {machinery.brand}
          </div>
        </div>

        <CardContent className="p-5 flex-1 space-y-4">
          <div>
            <CardTitle className="text-lg font-bold font-display text-white group-hover:text-gold transition-colors duration-300 line-clamp-1">
              {machinery.name}
            </CardTitle>
            <div className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50 inline-block"></span>
              {machinery.model}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-display">
              ${machinery.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">USD</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-gold/70" />
              <span className="truncate">{machinery.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-gold/70" />
              <span>{machinery.year}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
              <Activity className="w-3.5 h-3.5 text-gold/70" />
              <span>{machinery.hours || '0'} Operating Hours</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 mt-auto grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-wide h-10"
            onClick={() => router.push(`/machinery/${machinery._id}`)}
          >
            Details
          </Button>
          <Button
            className="w-full btn-gold text-navy font-bold text-xs uppercase tracking-wide h-10"
            onClick={() => onQuickInquiry(machinery)}
          >
            Inquire
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
