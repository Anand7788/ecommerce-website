// src/pages/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, deleteProduct, uploadProductCSV } from '../api/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // CSV Upload State
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    stock: '',
    sku: '',
    image_url: '',
    description: ''
  });
  
  // Validation State
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  // Handle CSV Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file.');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await uploadProductCSV(data);
      if (res.errors && res.errors.length > 0) {
        alert(`Imported with some errors:\n${res.errors.join('\n')}`);
      } else {
        alert(res.message || 'Import successful!');
      }
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to upload CSV.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    
    if (!formData.price) {
       newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
       newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock) {
        newErrors.stock = 'Stock is required';
    } else if (parseInt(formData.stock) < 0) {
        newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.image_url.trim()) {
        newErrors.image_url = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.image_url)) {
        newErrors.image_url = 'Must be a valid URL (http/https)';
    }

    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      await createProduct({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
      });
      setSuccessMsg('Product created successfully!');
      setFormData({
        name: '', price: '', category: 'Electronics', stock: '', sku: '', image_url: '', description: ''
      });
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to create product. Ensure you are logged in as Admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm('Are you sure you want to delete this product?')) return;
      try {
          await deleteProduct(id);
          loadProducts();
      } catch(err) {
          alert('Failed to delete.');
      }
  };

  return (
    <div className="admin-products-page">
      <div className="admin-header">
         <div className="admin-title">
           <h2>Products</h2>
           <p>Manage your product catalog</p>
         </div>
         
         {/* CSV Upload Button */}
         <div>
            <label 
               className="btn-submit" 
               style={{cursor:'pointer', background: uploading ? '#9ca3af' : '#4f46e5', display:'inline-block'}}
            >
               {uploading ? 'Importing...' : 'Import CSV'}
               <input 
                 type="file" 
                 accept=".csv" 
                 onChange={handleFileUpload} 
                 style={{display:'none'}} 
                 disabled={uploading}
               />
            </label>
         </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:32}}>
          {/* Add Product Form */}
          <div className="form-card">
              <h3 style={{marginBottom:24}}>Add New Product</h3>
              {successMsg && <div style={{background:'#d1fae5', color:'#065f46', padding:10, borderRadius:8, marginBottom:20}}>{successMsg}</div>}
              
              <form onSubmit={handleSubmit}>
                  <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input 
                        type="text" name="name" 
                        className="form-input" 
                        value={formData.name} onChange={handleChange} 
                        placeholder="e.g. Nike Air Max"
                      />
                      {errors.name && <div className="error-msg">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                      <label className="form-label">SKU</label>
                      <input 
                        type="text" name="sku" 
                        className="form-input" 
                        value={formData.sku} onChange={handleChange} 
                        placeholder="e.g. NK-001"
                      />
                      {errors.sku && <div className="error-msg">{errors.sku}</div>}
                  </div>

                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                    <div className="form-group">
                        <label className="form-label">Price (₹)</label>
                        <input 
                            type="number" name="price" 
                            className="form-input" 
                            value={formData.price} onChange={handleChange}
                            placeholder="0.00"
                        />
                        {errors.price && <div className="error-msg">{errors.price}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Stock</label>
                        <input 
                            type="number" name="stock" 
                            className="form-input" 
                            value={formData.stock} onChange={handleChange}
                            placeholder="0"
                        />
                        {errors.stock && <div className="error-msg">{errors.stock}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                      <label className="form-label">Category</label>
                      <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                          <option value="Electronics">Electronics</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Appliances">Appliances</option>
                          <option value="Fashion">Fashion</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input 
                          type="text" name="image_url" 
                          className="form-input" 
                          value={formData.image_url} onChange={handleChange}
                          placeholder="https://..."
                      />
                      {errors.image_url && <div className="error-msg">{errors.image_url}</div>}
                  </div>

                  <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea 
                          name="description" 
                          className="form-textarea" 
                          rows="3"
                          value={formData.description} onChange={handleChange}
                      ></textarea>
                      {errors.description && <div className="error-msg">{errors.description}</div>}
                  </div>

                  <button type="submit" className="btn-submit" disabled={submitting}>
                      {submitting ? 'Creating...' : 'Create Product'}
                  </button>
              </form>
          </div>

          {/* Product List */}
          <div className="chart-card">
              <h3 style={{marginBottom:24}}>Existing Products</h3>
              <div style={{maxHeight:700, overflowY:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                    <thead>
                        <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6'}}>
                            <th style={{padding:12}}>IMG</th>
                            <th style={{padding:12}}>Name</th>
                            <th style={{padding:12}}>Price</th>
                            <th style={{padding:12}}>Stock</th>
                            <th style={{padding:12}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{borderBottom:'1px solid #f9fafb'}}>
                                <td style={{padding:12}}>
                                    <img src={p.image_url} style={{width:40, height:40, borderRadius:4, objectFit:'cover'}} alt="" />
                                </td>
                                <td style={{padding:12, fontWeight:500}}>{p.name}</td>
                                <td style={{padding:12}}>₹{p.price || (p.price_cents/100)}</td>
                                <td style={{padding:12}}>
                                    <span style={{
                                        padding:'2px 8px', borderRadius:10, fontSize:12,
                                        background: p.stock > 10 ? '#d1fae5' : '#fee2e2',
                                        color: p.stock > 10 ? '#065f46' : '#991b1b'
                                    }}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td style={{padding:12}}>
                                    <button 
                                        onClick={() => handleDelete(p.id)}
                                        style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer'}}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>
      </div>
    </div>
  );
}
