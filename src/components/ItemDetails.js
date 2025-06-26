import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, MessageCircle, Calendar, User, ArrowLeft, ChevronLeft, ChevronRight, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function ItemDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      const itemDoc = await getDoc(doc(db, 'items', itemId));
      if (itemDoc.exists()) {
        setItem({ id: itemDoc.id, ...itemDoc.data() });
      } else {
        toast.error('Item not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item');
      navigate('/');
    } finally {
      setLoading(false);
    }
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

  const handleStatusToggle = async () => {
    if (!currentUser || currentUser.uid !== item.sellerId) {
      toast.error('You can only change status of your own items');
      return;
    }

    try {
      const newStatus = item.status === 'available' ? 'sold' : 'available';
      await updateDoc(doc(db, 'items', itemId), {
        status: newStatus
      });
      
      setItem(prev => ({ ...prev, status: newStatus }));
      toast.success(`Item marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!currentUser || currentUser.uid !== item.sellerId) {
      toast.error('You can only delete your own items');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      // Note: In a real app, you'd also delete the images from Storage
      await updateDoc(doc(db, 'items', itemId), {
        status: 'deleted'
      });
      
      toast.success('Item deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === item.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.imageUrls.length - 1 : prev - 1
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const isOwner = currentUser && currentUser.uid === item.sellerId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </button>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Image Carousel */}
          <div className="relative">
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <>
                <img
                  src={item.imageUrls[currentImageIndex]}
                  alt={`${item.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                {item.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {item.imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500">No images available</span>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{item.sellerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ₹{item.price}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'available' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {item.status === 'available' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Sold
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {!isOwner && (
                <>
                  <button
                    onClick={handleEmailContact}
                    className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Contact via Email
                  </button>
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact via WhatsApp
                  </button>
                </>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={handleStatusToggle}
                    className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      item.status === 'available'
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    }`}
                  >
                    {item.status === 'available' ? (
                      <>
                        <XCircle className="h-5 w-5 mr-2" />
                        Mark as Sold
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Mark as Available
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center px-6 py-3 border border-red-300 dark:border-red-600 rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Item
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 