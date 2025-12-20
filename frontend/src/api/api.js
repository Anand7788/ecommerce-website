import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// PRODUCTS
export async function fetchProducts() { return (await api.get('/products')).data; }
export async function fetchProduct(id) { return (await api.get(`/products/${id}`)).data; }
export async function createProduct(productData) { return (await api.post('/products', { product: productData })).data; }
export async function deleteProduct(id) { return (await api.delete(`/products/${id}`)).data; }

// CART
export async function addToCart(product_id, quantity = 1) { return (await api.post('/cart/add_item', { product_id, quantity })).data; }
export async function getCart() { return (await api.get('/cart')).data; }
export async function updateCartItem(cart_item_id, quantity) { return (await api.patch('/cart/update_item', { cart_item_id, quantity })).data; }
export async function removeCartItem(cart_item_id) { return (await api.delete('/cart/remove_item', { data: { cart_item_id } })).data; }

// ORDERS
export async function createOrder(cart_id, address) {
  const res = await api.post('/orders', { cart_id, address });
  return res.data;
}
export async function fetchOrders() { return (await api.get('/orders')).data; }
export async function fetchOrder(id) { return (await api.get(`/orders/${id}`)).data; }

// AUTH
export async function login(email, password) {
  const res = await api.post('/login', { email, password });
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
    // Store as string 'true' or 'false'
    localStorage.setItem('is_admin', res.data.user.admin);
  }
  return res.data;
}

export async function signup(userObj) {
  const res = await api.post('/signup', { user: userObj });
  if (res.data?.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

// ADMIN ANALYTICS
export async function fetchAdminAnalytics() { return (await api.get('/admin/analytics')).data; }
export async function fetchAdminOrders() { return (await api.get('/admin/orders')).data; }
export async function fetchAdminOrder(id) { return (await api.get(`/admin/orders/${id}`)).data; }
export async function updateOrderStatus(id, status) { return (await api.patch(`/admin/orders/${id}`, { status })).data; }
export async function fetchAdminCustomers() { return (await api.get('/admin/users')).data; }
export async function fetchAdminCustomer(id) { return (await api.get(`/admin/users/${id}`)).data; }

// PASSWORD RESET
export async function sendPasswordReset(email) { return (await api.post('/password_resets', { email })).data; }
export async function resetPassword(token, password) { return (await api.post('/password_resets/reset', { token, password })).data; }
export async function changePassword(current_password, new_password) { return (await api.patch('/password/update', { current_password, new_password })).data; }

// PROFILE & ADDRESSES
export async function fetchProfile() { return (await api.get('/me')).data; }
export async function updateProfile(data) { return (await api.patch('/me', { user: data })).data; }

export async function fetchAddresses() { return (await api.get('/addresses')).data; }
export async function createAddress(data) { return (await api.post('/addresses', { address: data })).data; }
export async function updateAddress(id, data) { return (await api.patch(`/addresses/${id}`, { address: data })).data; }
export async function deleteAddress(id) { return (await api.delete(`/addresses/${id}`)).data; }
