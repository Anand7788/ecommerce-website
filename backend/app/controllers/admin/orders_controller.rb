# app/controllers/admin/orders_controller.rb
module Admin
  class OrdersController < ApplicationController
    def index
      orders = Order.includes(:user).order(created_at: :desc)
      render json: orders.map { |o|
        {
          id: o.id,
          user: o.user ? { name: o.user.name, email: o.user.email } : { name: "Guest", email: "-" },
          total_price: o.total_price,
          status: o.status,
          created_at: o.created_at,
          items_count: o.order_items.sum(:quantity)
        }
      }
    end

    def update
      order = Order.find(params[:id])
      old_status = order.status
      if order.update(status: params[:status])
        # Create Log
        if old_status != order.status
           order.order_status_logs.create(status: order.status, notes: "Status updated by Admin")
        end
        render json: order
      else
        render json: { error: "Failed to update" }, status: :unprocessable_entity
      end
    end

    def show
      order = Order.includes(:user, order_items: :product).find(params[:id])
      render json: {
        id: order.id,
        created_at: order.created_at,
        total_price: order.total_price,
        status: order.status,
        address: order.address,
        user: order.user ? { id: order.user.id, name: order.user.name, email: order.user.email } : nil,
        items: order.order_items.map { |item|
          {
            id: item.id,
            product_id: item.product_id,
            name: item.product&.name || "Unknown Product",
            image_url: item.product&.image_url,
            price: item.price,
            quantity: item.quantity
          }
        }
      }
    end
  end
end
