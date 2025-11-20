class OrdersController < ApplicationController
  before_action :authenticate_user!, only: [:index, :show, :create]

  # GET /orders
  def index
    orders = current_user.orders.order(created_at: :desc)
    render json: orders.as_json(include: { order_items: { include: :product } })
  end

  # GET /orders/:id
  def show
    order = current_user.orders.find(params[:id])
    render json: order.as_json(include: { order_items: { include: :product } })
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Order not found" }, status: :not_found
  end

  # POST /orders
  # body: { cart_id:, address: "shipping address" }
  def create
    cart = Cart.find(params[:cart_id])
    unless cart && cart.cart_items.any?
      return render json: { error: 'Cart is empty' }, status: :unprocessable_entity
    end

    order = current_user.orders.create!(address: params[:address], status: 'pending')
    cart.cart_items.each do |ci|
      order.order_items.create!(product: ci.product, quantity: ci.quantity, price: ci.price)
    end
    order.calculate_total!

    cart.update(status: 'ordered')   # mark cart closed
    render json: order.as_json(include: { order_items: { include: :product } }), status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Cart not found' }, status: :not_found
  end
end
