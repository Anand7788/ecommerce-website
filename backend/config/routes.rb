Rails.application.routes.draw do
  # Auth
  post '/signup', to: 'users#create'
  post '/login',  to: 'sessions#create'

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
  end

  root "products#index"
end
