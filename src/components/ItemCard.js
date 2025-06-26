import React from 'react';
import { Mail, MessageCircle, Calendar, User } from 'lucide-react';

export default function ItemCard({ item }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`Inquiry about ${item.title}`);
    const body = encodeURIComponent(`Hi ${item.sellerName},\n\nI'm interested in your ${item.title} listed for ₹${item.price}.\n\nCould you please provide more details?\n\nThanks!`);
    window.open(`mailto:${item.sellerEmail}?subject=${subject}&body=${body}`);
  };

  const handleWhatsAppContact = () => {
    if (!item.whatsappNumber) {
      alert('WhatsApp number not available for this seller');
      return;
    }
    
    const message = encodeURIComponent(`Hi! I'm interested in your ${item.title} listed for ₹${item.price}. Could you provide more details?`);
    const whatsappUrl = `https://wa.me/${item.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          <span className="text-xl font-bold text-primary-600">
            ₹{item.price}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="h-4 w-4 mr-1" />
          <span className="truncate">{item.sellerName}</span>
          <span className="mx-2">•</span>
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(item.createdAt)}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleEmailContact}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </button>
          <button
            onClick={handleWhatsAppContact}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
} 