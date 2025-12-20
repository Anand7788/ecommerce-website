# app/controllers/admin/users_controller.rb
module Admin
  class UsersController < ApplicationController
    def index
      users = User.where(admin: false).includes(:orders)
      render json: users.map { |u|
        {
          id: u.id,
          name: u.name,
          email: u.email,
          created_at: u.created_at,
          total_orders: u.orders.count,
          total_spent: u.orders.sum(:total_price)
        }
      }
    end

    def show
      user = User.find(params[:id])
      orders = user.orders.order(created_at: :desc)
      last_order = orders.first
      
      render json: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        address: last_order ? last_order.address : nil, # Best effort address
        stats: {
          total_orders: orders.count,
          total_spent: orders.sum(:total_price)
        },
        orders: orders.map { |o| 
          {
            id: o.id,
            created_at: o.created_at,
            total_price: o.total_price,
            status: o.status,
            items_count: o.order_items.sum(:quantity)
          }
        }
      }
    end
  end
end
