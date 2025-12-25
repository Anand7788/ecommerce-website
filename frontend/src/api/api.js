import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  // headers: { 'Content-Type': 'application/json' }, // Let Axios/Browser handle this matches data type
});

// Helper to generate a random ID if crypto is not available
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ALWAYS handle guest token, even if logged in (optional, but good for mixing)
  // But for now, we strictly follow the else logic or just ensure it exists
  let guestToken = localStorage.getItem('guest_token');
  if (!guestToken) {
    guestToken = generateUUID();
    localStorage.setItem('guest_token', guestToken);
  }

  // If no auth token, we MUST send guest token
  if (!token) {
    config.headers['Cart-Token'] = guestToken;
  }

  return config;
});

api.interceptors.response.use(response => {
  const newGuestToken = response.headers['cart-token'];
  if (newGuestToken) {
    localStorage.setItem('guest_token', newGuestToken);
  }
  return response;
});

// PRODUCTS
export async function fetchProducts() { return (await api.get('/products')).data; }
export async function fetchProduct(id) { return (await api.get(`/products/${id}`)).data; }
export async function createProduct(productData) { return (await api.post('/admin/products', { product: productData })).data; }
export async function updateProduct(id, productData) { return (await api.patch(`/admin/products/${id}`, { product: productData })).data; }
export async function deleteProduct(id) { return (await api.delete(`/admin/products/${id}`)).data; }
export async function uploadProductCSV(formData) {
  return (await api.post('/admin/product_bulk_import', formData)).data;
}

// CART
// CART
export async function addToCart(product_id, quantity = 1) {
  const res = (await api.post('/cart/add_item', { product_id, quantity })).data;
  window.dispatchEvent(new Event('cartUpdated'));
  return res;
}
export async function getCart() { return (await api.get('/cart')).data; }
export async function updateCartItem(cart_item_id, quantity) {
  const res = (await api.patch('/cart/update_item', { cart_item_id, quantity })).data;
  window.dispatchEvent(new Event('cartUpdated'));
  return res;
}
export async function removeCartItem(cart_item_id) {
  const res = (await api.delete('/cart/remove_item', { data: { cart_item_id } })).data;
  window.dispatchEvent(new Event('cartUpdated'));
  return res;
}

// ORDERS
export async function createOrder(cart_id, address, payment_method = 'Razorpay', discount_amount = 0, coupon_code = null) {
  const res = await api.post('/orders', {
    cart_id,
    address,
    payment_method,
    discount_amount,
    coupon_code
  });
  window.dispatchEvent(new Event('cartUpdated'));
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

export async function checkEmail(email) {
  const res = await api.post('/check_email', { email });
  return res.data; // { exists: true/false }
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
