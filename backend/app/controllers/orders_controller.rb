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
    render json: order.as_json(include: { order_items: { include: :product }, order_status_logs: {} })
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

    puts "DEBUG: OrdersController#create Params: #{params.inspect}"
    
    order = current_user.orders.create!(
      address: params[:address], 
      status: 'pending',
      payment_method: params[:payment_method] || 'Razorpay', # Default to Razorpay if missing, or handle logic
      discount_amount: params[:discount_amount],
      coupon_code: params[:coupon_code]
    )
    
    # Create initial log
    order.order_status_logs.create!(status: 'pending', notes: 'Order placed successfully')
    
    cart.cart_items.each do |ci|
      order.order_items.create!(product: ci.product, quantity: ci.quantity, price: ci.price)
    end
    
    # We might want to trust frontend total or recalculate. 
    # For now, let's recalculate base total but subtract discount?
    # Actually, calculate_total! sums items. We should probably subtract discount from that if we want "final total".
    # But let's just save the discount and let frontend display it.
    order.calculate_total!
    
    # If we want total_price to reflect the discounted price:
    if order.discount_amount.present?
       # Ensure we don't go below zero
       final = [order.total_price - order.discount_amount, 0].max
       order.update(total_price: final)
    end

    cart.update(status: 'ordered')   # mark cart closed
    render json: order.as_json(include: { order_items: { include: :product } }), status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Cart not found' }, status: :not_found
  end
end
