Rails.application.routes.draw do
  # Auth
  # Auth & User
  post '/signup', to: 'users#create'
  get  '/me', to: 'users#show'
  patch '/me', to: 'users#update'
  post '/check_email', to: 'users#check_email'
  
  resources :addresses
  resources :wishlist_items, only: [:index, :create, :destroy], path: 'wishlist'
  
  post '/login',  to: 'sessions#create'

  post '/login',  to: 'sessions#create'
  
  # Password Reset (Forgot Password)
  post '/password_resets', to: 'password_resets#create'
  post '/password_resets/reset', to: 'password_resets#update'

  # Change Password (Logged In)
  patch '/password/update', to: 'passwords#update'

  # Cart endpoints
  get '/cart', to: 'carts#show'
  post '/cart/add_item', to: 'carts#add_item'
  patch '/cart/update_item', to: 'carts#update_item'
  delete '/cart/remove_item', to: 'carts#remove_item'

  # Orders
  resources :orders, only: [:index, :show, :create]

  # Public product endpoints
  resources :products, only: [:index, :show] do
    resources :reviews, only: [:index, :create]
  end

  # Admin product management
  namespace :admin do
    resources :products, only: [:index, :show, :create, :update, :destroy]
    post 'product_bulk_import', to: 'products#import_csv'
    resources :orders, only: [:index, :update, :show]
    resources :users, only: [:index, :show] # Customers
    get '/analytics', to: 'analytics#show'
    resources :coupons, only: [:index, :create, :update, :destroy], controller: '/coupons'
    resources :reviews, only: [:index, :destroy]
  end

  namespace :api do
    post 'payments/create_order', to: 'payments#create_order'
    post 'payments/verify', to: 'payments#verify'
  end

  post 'coupons/validate', to: 'coupons#validate'

  root "products#index"
end
