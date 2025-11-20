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
export async function fetchProducts(){ return (await api.get('/products')).data; }
export async function fetchProduct(id){ return (await api.get(`/products/${id}`)).data; }

// CART
export async function addToCart(product_id, quantity = 1){ return (await api.post('/cart/add_item', { product_id, quantity })).data; }
export async function getCart(){ return (await api.get('/cart')).data; }
export async function updateCartItem(cart_item_id, quantity){ return (await api.patch('/cart/update_item', { cart_item_id, quantity })).data; }
export async function removeCartItem(cart_item_id){ return (await api.delete('/cart/remove_item', { data: { cart_item_id } })).data; }

// ORDERS
export async function createOrder(cart_id, address){
  const res = await api.post('/orders', { cart_id, address });
  return res.data;
}
export async function fetchOrders(){ return (await api.get('/orders')).data; }

// AUTH
export async function login(email, password){
  const res = await api.post('/login', { email, password });
  if(res.data?.token) localStorage.setItem('token', res.data.token);
  return res.data;
}

export async function signup(userObj){
  const res = await api.post('/signup', { user: userObj });
  if(res.data?.token) localStorage.setItem('token', res.data.token);
  return res.data;
}
