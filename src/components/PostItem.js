import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { X, Phone, Image as ImageIcon } from 'lucide-react';

export default function PostItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB per image.`);
        return;
      }
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const validateWhatsAppNumber = (number) => {
    const clean = number.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
  };

  const uploadImages = async () => {
    const urls = [];
    for (let file of images) {
      const imageRef = ref(storage, `items/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price.trim() || !whatsappNumber.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!validateWhatsAppNumber(whatsappNumber)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
        toast.success(`${images.length} image(s) uploaded!`);
      }
      await addDoc(collection(db, 'items'), {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        whatsappNumber: '+91' + whatsappNumber.replace(/\D/g, ''),
        imageUrls,
        sellerId: currentUser.uid,
        sellerName: currentUser.displayName || currentUser.email,
        sellerEmail: currentUser.email,
        createdAt: serverTimestamp(),
        status: 'available',
      });
      toast.success('Item posted successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error posting item:', err);
      toast.error('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Post New Item</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp Number *</label>
              <input type="tel" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} maxLength={10} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Images (max 5, each ≤ 5MB)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              <div className="flex flex-wrap mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative mr-2 mb-2">
                    <img src={URL.createObjectURL(img)} alt="preview" className="w-20 h-20 object-cover rounded" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1">x</button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Posting...' : 'Post Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 