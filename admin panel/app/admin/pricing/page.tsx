'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface PricingItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pricing/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data.data[0].name }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
  
  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/pricing?category=${activeCategory}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };
  
  const handleAdd = async () => {
    try {
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price), category: (formData.category || 'All').trim() })
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({ name: '', price: '', category: categories[0]?.name || '' });
        setShowAddForm(false);
        fetchItems();
      } else {
        alert('Error: ' + (data.error || 'Failed to add item'));
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/pricing/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      if (response.ok) {
        setNewCategoryName('');
        setShowCategoryForm(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/pricing/categories?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };
  
  const handleUpdate = async (item: PricingItem) => {
    try {
      const response = await fetch('/api/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, name: item.name, price: item.price, category: item.category })
      });
      if (response.ok) {
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/pricing?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <ResponsiveLayout activePage="Pricing" title="Pricing Management" searchPlaceholder="Search Item">
        
        <div style={{ padding: '1.5rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setActiveCategory('All')}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: activeCategory === 'All' ? '#2563eb' : 'white', 
                  color: activeCategory === 'All' ? 'white' : '#2563eb', 
                  border: activeCategory === 'All' ? 'none' : '1px solid #2563eb', 
                  borderRadius: '6px', 
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              {categories.map(category => (
                <div key={category._id} style={{ position: 'relative', display: 'inline-block' }}>
                  <button 
                    onClick={() => setActiveCategory(category.name)}
                    style={{ 
                      padding: '0.5rem 1.5rem 0.5rem 1rem', 
                      backgroundColor: activeCategory === category.name ? '#2563eb' : 'white', 
                      color: activeCategory === category.name ? 'white' : '#2563eb', 
                      border: activeCategory === category.name ? 'none' : '1px solid #2563eb', 
                      borderRadius: '6px', 
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    {category.name}
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setShowCategoryForm(true)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: 'white', 
                  color: '#2563eb', 
                  border: '1px solid #2563eb', 
                  borderRadius: '6px', 
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                + Add Category
              </button>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}
            >
              Add New Item
            </button>
          </div>

          {/* Items Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 3fr', gap: '1rem', fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', border: 'none' }}>
              <div>Item Name</div>
              <div>Price</div>
              <div>Last Updated</div>
              <div>Actions</div>
            </div>

            {items.map((item, index) => (
              <div key={item._id} style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 3fr', gap: '1rem', borderTop: '1px solid #f3f4f6', fontSize: '0.9rem', alignItems: 'center' }}>
                <div>
                  {editingItem?._id === item._id ? (
                    <input 
                      type="text" 
                      value={editingItem.name} 
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', width: '100%' }} 
                    />
                  ) : (
                    item.name
                  )}
                </div>
                <div>
                  {editingItem?._id === item._id ? (
                    <input 
                      type="number" 
                      value={editingItem.price} 
                      onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                      style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', width: '80px' }} 
                    />
                  ) : (
                    `₹${item.price}`
                  )}
                </div>
                <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setEditingItem(item)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => editingItem?._id === item._id ? handleUpdate(editingItem) : null}
                    disabled={editingItem?._id !== item._id}
                    style={{ padding: '0.5rem 1rem', backgroundColor: editingItem?._id === item._id ? '#10b981' : '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: editingItem?._id === item._id ? 'pointer' : 'not-allowed' }}
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    style={{ padding: '0.5rem 1px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Add New Item</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Item Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter item name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Current Price</label>
                    <input 
                      type="number" 
                      placeholder="Enter price" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                    >
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    onClick={handleAdd}
                    disabled={!formData.name || !formData.price}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: formData.name && formData.price ? '#10b981' : '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: formData.name && formData.price ? 'pointer' : 'not-allowed', fontSize: '0.9rem', fontWeight: '500' }}
                  >
                    Add Item
                  </button>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category Form */}
          {showCategoryForm && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Add New Category</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Category Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter category name" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    onClick={handleAddCategory}
                    disabled={!newCategoryName}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: newCategoryName ? '#10b981' : '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: newCategoryName ? 'pointer' : 'not-allowed', fontSize: '0.9rem', fontWeight: '500' }}
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setShowCategoryForm(false)}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Items */}
          {items.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '2rem' }}>
              <img src="/pricing page.svg" alt="No items" style={{ width: '100px', height: 'auto' }} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>No items found.</h3>
                <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{items.length} items</div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}
