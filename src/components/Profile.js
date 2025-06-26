import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Trash2, CheckCircle, XCircle, Calendar, User } from 'lucide-react';

export default function Profile() {
  const { currentUser } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserItems = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'items'),
        where('sellerId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserItems(items);
    } catch (error) {
      console.error('Error fetching user items:', error);
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  }, [currentUser.uid]);

  useEffect(() => {
    fetchUserItems();
  }, [fetchUserItems]);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      // Mark as deleted instead of actually deleting (for data integrity)
      await updateDoc(doc(db, 'items', itemId), {
        status: 'deleted'
      });
      
      setUserItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleStatusToggle = async (itemId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'sold' : 'available';
      await updateDoc(doc(db, 'items', itemId), {
        status: newStatus
      });
      
      setUserItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      
      toast.success(`Item marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your posted items
          </p>
        </div>

        {userItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <User className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No items posted yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by posting your first sensor item!
            </p>
            <a
              href="/post-item"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Post Your First Item
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Item Image */}
                <div className="aspect-w-16 aspect-h-9">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'available' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : item.status === 'sold'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {item.status === 'available' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Available
                        </>
                      ) : item.status === 'sold' ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Sold
                        </>
                      ) : (
                        'Deleted'
                      )}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {item.status !== 'deleted' && (
                      <>
                        <button
                          onClick={() => handleStatusToggle(item.id, item.status)}
                          className={`flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            item.status === 'available'
                              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          }`}
                        >
                          {item.status === 'available' ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Mark Sold
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Available
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center justify-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 