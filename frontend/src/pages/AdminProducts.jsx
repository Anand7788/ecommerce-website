// src/pages/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, deleteProduct, uploadProductCSV, updateProduct } from '../api/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // CSV Upload State
  const [uploading, setUploading] = useState(false);
  
  // Edit Mode State
  const [editingId, setEditingId] = useState(null);
  
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
      const serverError = err.response?.data?.error || err.response?.data?.message || 'Failed to upload CSV.';
      alert(`Upload Error: ${serverError}`);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `name,price,description,category,stock,image_url
Wireless Noise Cancelling Headphones,3999.00,Premium over-ear headphones with active noise cancellation and 30-hour battery life.,Electronics,45,https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop
Smart Fitness Watch,2499.00,Track your health metrics, steps, and sleep with this waterproof smart watch.,Electronics,120,https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop
Minimalist Cotton T-Shirt,499.00,100% organic cotton t-shirt in basic colors. Comfortable and breathable.,Fashion,200,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop
Slim Fit Blue Jeans,1299.00,Classic blue denim jeans with a modern slim fit cut. Durable and stylish.,Fashion,85,https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop
Smartphone X Pro,69999.00,Flagship smartphone with 108MP camera, 5G connectivity, and OLED display.,Mobile,30,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop
Budget Android Phone,8999.00,Reliable smartphone with long battery life and essential features.,Mobile,150,https://images.unsplash.com/photo-1598327770691-7dadf1677fd4?q=80&w=1000&auto=format&fit=crop
Automatic Coffee Maker,4500.00,Brew fresh coffee every morning with programmable timer and keep-warm function.,Appliances,40,https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop
Robot Vacuum Cleaner,15999.00,Smart robot vacuum with mapping technology and app control for automated cleaning.,Appliances,25,https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=1000&auto=format&fit=crop
Leather Wallet,899.00,Genuine leather wallet with multiple card slots and RFID protection.,Fashion,100,https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=1000&auto=format&fit=crop
4K LED Smart TV 55 inch,35000.00,Ultra HD Smart TV with HDR support and built-in streaming apps.,Electronics,15,https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop
Bluetooth Portable Speaker,1999.00,Waterproof portable speaker with deep bass and rugged design.,Electronics,75,https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop
Stainless Steel Toaster,2200.00,2-slice toaster with browning control and defrost setting.,Appliances,60,https://images.unsplash.com/photo-1585694248888-06eb183d29bd?q=80&w=1000&auto=format&fit=crop`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sample_products.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      const payload = {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await createProduct(payload);
        setSuccessMsg('Product created successfully!');
      }

      setFormData({
        name: '', price: '', category: 'Electronics', stock: '', sku: '', image_url: '', description: ''
      });
      setEditingId(null); // Exit edit mode
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Ensure you are logged in as Admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price ? product.price.toString() : (product.price_cents / 100).toString(),
      category: product.category || 'Electronics',
      stock: product.stock.toString(),
      sku: product.sku || '',
      image_url: product.image_url || '',
      description: product.description || ''
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '', price: '', category: 'Electronics', stock: '', sku: '', image_url: '', description: ''
    });
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

  const handleExportCSV = () => {
    if (products.length === 0) {
      alert('No products to export.');
      return;
    }
    
    // Header
    let csvContent = "id,name,sku,price,stock,category,image_url,description\n";
    
    // Rows
    products.forEach(p => {
      const row = [
        p.id,
        // Wrap strings in quotes to handle commas
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.sku || '').replace(/"/g, '""')}"`,
        p.price || (p.price_cents / 100),
        p.stock,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        `"${(p.image_url || '').replace(/"/g, '""')}"`,
        `"${(p.description || '').replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "products_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
         {/* Actions */}
         <div className="admin-products-actions">
            <label 
               className="btn-submit" 
               style={{cursor:'pointer', background: uploading ? '#9ca3af' : '#4f46e5', margin:0}}
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
            <button 
              onClick={downloadSampleCSV} 
              className="btn-round"
            >
              Download Template
            </button>
         </div>
      </div>

      <div className="admin-products-layout">
          {/* Add Product Form */}
          <div className="form-card">
              <h3 style={{marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                {editingId ? 'Edit Product' : 'Add New Product'}
                {editingId && (
                  <button onClick={cancelEdit} style={{fontSize:12, padding:'4px 8px', background:'#f3f4f6', border:'none', borderRadius:4, cursor:'pointer'}}>
                     Cancel
                  </button>
                )}
              </h3>
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
                            step="0.01"
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
                      {submitting ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                  </button>
              </form>
          </div>

          {/* Product List */}
          <div className="chart-card">
              <div className="section-header">
                <h3 style={{margin: 0}}>Existing Products</h3>
                <button 
                  onClick={handleExportCSV}
                  className="btn-round"
                >
                  Export Products
                </button>
              </div>
              {/* Desktop Table View */}
              <div className="desktop-table-container">
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                    <thead>
                        <tr style={{textAlign:'left', color:'#9ca3af', borderBottom:'1px solid #f3f4f6'}}>
                            <th style={{padding:12, width:'10%'}}>IMG</th>
                            <th style={{padding:12, width:'30%'}}>Name</th>
                            <th style={{padding:12, width:'15%'}}>Price</th>
                            <th style={{padding:12, width:'15%', textAlign:'center'}}>Stock</th>
                            <th style={{padding:12, width:'30%', textAlign:'center'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{borderBottom:'1px solid #f9fafb'}}>
                                <td style={{padding:12, verticalAlign:'middle'}}>
                                    <img src={p.image_url} style={{width:40, height:40, borderRadius:4, objectFit:'cover'}} alt="" />
                                </td>
                                <td style={{padding:12, fontWeight:500, verticalAlign:'middle'}}>
                                    {p.name}
                                </td>
                                <td style={{padding:12, verticalAlign:'middle'}}>₹{p.price || (p.price_cents/100)}</td>
                                <td style={{padding:12, textAlign:'center', verticalAlign:'middle'}}>
                                    <span style={{
                                        padding:'2px 8px', borderRadius:10, fontSize:12,
                                        background: p.stock > 10 ? '#d1fae5' : '#fee2e2',
                                        color: p.stock > 10 ? '#065f46' : '#991b1b',
                                        display: 'inline-block'
                                    }}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td style={{padding:12, textAlign:'center', verticalAlign:'middle'}}>
                                    <button 
                                        onClick={() => handleEdit(p)}
                                        style={{color:'#4f46e5', background:'none', border:'none', cursor:'pointer', marginRight:10, fontWeight:500}}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(p.id)}
                                        style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontWeight:500}}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="mobile-product-list">
                {products.map(p => (
                   <div key={p.id} className="mobile-product-card">
                      <div style={{display:'flex', gap:12}}>
                         <img src={p.image_url} style={{width:60, height:60, borderRadius:8, objectFit:'cover'}} alt="" />
                         <div style={{flex:1}}>
                            <div style={{fontWeight:600, fontSize:14, marginBottom:4}}>{p.name}</div>
                            <div style={{color:'#6b7280', fontSize:13, marginBottom:6}}>SKU: {p.sku || 'N/A'}</div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <div style={{fontWeight:700, color:'#10b981'}}>₹{p.price || (p.price_cents/100)}</div>
                                <span style={{
                                    padding:'2px 8px', borderRadius:10, fontSize:11,
                                    background: p.stock > 10 ? '#d1fae5' : '#fee2e2',
                                    color: p.stock > 10 ? '#065f46' : '#991b1b'
                                }}>
                                    Stock: {p.stock}
                                </span>
                            </div>
                         </div>
                      </div>
                      <div style={{borderTop:'1px solid #f3f4f6', marginTop:12, paddingTop:12, display:'flex', gap:12}}>
                          <button 
                              onClick={() => handleEdit(p)}
                              style={{flex:1, padding:'8px', borderRadius:6, border:'1px solid #e5e7eb', background:'white', color:'#4f46e5', fontWeight:500, cursor:'pointer'}}
                          >
                              Edit
                          </button>
                          <button 
                              onClick={() => handleDelete(p.id)}
                              style={{flex:1, padding:'8px', borderRadius:6, border:'1px solid #fee2e2', background:'#fef2f2', color:'#ef4444', fontWeight:500, cursor:'pointer'}}
                          >
                              Delete
                          </button>
                      </div>
                   </div>
                ))}
              </div>
          </div>
      </div>
    </div>
  );
}
