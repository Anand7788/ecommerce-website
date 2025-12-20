Rails.application.routes.draw do
  # Auth
  # Auth & User
  post '/signup', to: 'users#create'
  get  '/me', to: 'users#show'
  patch '/me', to: 'users#update'
  
  resources :addresses
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
  resources :products, only: [:index, :show]

  # Admin product management
  namespace :admin do
    resources :products, only: [:index, :show, :create, :update, :destroy]
    resources :orders, only: [:index, :update, :show]
    resources :users, only: [:index, :show] # Customers
    get '/analytics', to: 'analytics#show'
  end

  root "products#index"
end
