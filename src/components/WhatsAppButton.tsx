import React from 'react';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhatsAppButtonProps {
  message?: string;
  phoneNumber?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  phoneNumber = '966570196677',
  className = '',
}) => {
  const { t } = useTranslation();

  const handleWhatsApp = () => {
    const finalMessage = message || t('common.whatsapp_message');
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsApp}
      className={`bg-green-500 hover:bg-green-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 rounded-full px-6 py-6 ${className}`}
    >
      <MessageCircle className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
      <span className="font-bold tracking-wide">{t('common.whatsapp_label')}</span>
    </Button>
  );
};