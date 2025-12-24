class CartsController < ApplicationController
  before_action :set_cart

  # GET /cart
  def show
    render json: cart_json(@cart)
  end

  # POST /cart/add_item
  def add_item
    puts "DEBUG: add_item called. Params: #{params.inspect}"
    product = Product.find(params[:product_id])
    item = @cart.cart_items.find_by(product_id: product.id)
    puts "DEBUG: Found existing item? #{item.present?}"

    quantity = (params[:quantity] || 1).to_i

    if item
      item.update!(quantity: item.quantity + quantity)
      puts "DEBUG: Updated item quantity to #{item.quantity}"
    else
      new_item = @cart.cart_items.create!(product: product, quantity: quantity, price: product.price)
      puts "DEBUG: Created new item: #{new_item.inspect}"
      puts "DEBUG: Errors? #{new_item.errors.full_messages}" if new_item.errors.any?
    end

    render json: cart_json(@cart), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Product not found' }, status: :not_found
  end

  # PATCH /cart/update_item
  def update_item
    item = @cart.cart_items.find(params[:cart_item_id])
    new_qty = params[:quantity].to_i

    if new_qty <= 0
      item.destroy
    else
      item.update!(quantity: new_qty)
    end

    render json: cart_json(@cart), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Item not found' }, status: :not_found
  end

  # DELETE /cart/remove_item
  def remove_item
    item = @cart.cart_items.find(params[:cart_item_id])
    item.destroy
    render json: cart_json(@cart), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Item not found' }, status: :not_found
  end

  private

  # NO SESSIONS. We use either current_user OR guest_token.
  def set_cart
    if current_user
      @cart = current_user.carts.find_or_create_by(status: 'open')
    else
      @cart = find_or_create_anonymous_cart  # Comes from ApplicationController
    end
  end

  def cart_json(cart)
    {
      id: cart.id,
      guest_token: cart.guest_token,
      status: cart.status,
      items: cart.cart_items.includes(:product).map do |ci|
        {
          id: ci.id,
          product: {
            id: ci.product.id,
            name: ci.product.name,
            price: ci.price.to_f,
            image_url: ci.product.image_url
          },
          quantity: ci.quantity,
          line_total: (ci.price * ci.quantity).to_f
        }
      end,
      total: cart.total_price.to_f
    }
  end
end
