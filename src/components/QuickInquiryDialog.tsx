import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/useToast';

interface QuickInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productId: string;
}

export const QuickInquiryDialog: React.FC<QuickInquiryDialogProps> = ({
  open,
  onOpenChange,
  productName,
  productId,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in ${productName}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Send via WhatsApp
    const message = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nProduct: ${productName}\n\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/966570196677?text=${message}`, '_blank');

    toast.success('Inquiry Sent: Your inquiry has been sent via WhatsApp');

    onOpenChange(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: `I am interested in ${productName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-navy/95 border-white/10 text-white backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">Quick Inquiry</DialogTitle>
          <DialogDescription className="text-slate-400">
            Send a quick inquiry about <span className="text-gold font-bold">{productName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Full Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300">Phone</Label>
            <Input
              id="phone"
              placeholder="+966 5X XXX XXXX"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-300">Message</Label>
            <Textarea
              id="message"
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50 min-h-[100px]"
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="glass border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-gold font-bold text-navy hover:scale-105 transition-transform">
              Send via WhatsApp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};