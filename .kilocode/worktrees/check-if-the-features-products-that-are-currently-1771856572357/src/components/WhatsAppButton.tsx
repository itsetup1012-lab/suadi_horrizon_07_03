import React from 'react';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  phoneNumber?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = 'Hi, I am interested in your products',
  phoneNumber = '966570196677',
  className = '',
}) => {
  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsApp}
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      WhatsApp
    </Button>
  );
};