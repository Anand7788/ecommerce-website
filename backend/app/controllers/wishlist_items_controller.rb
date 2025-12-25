class WishlistItemsController < ApplicationController
  before_action :authenticate_user!

  # GET /wishlist
  def index
    wishlist_items = current_user.wishlist_items.includes(:product)
    
    # Transform to return list of products with wishlist_item_id
    render json: wishlist_items.map { |item| 
      item.product.as_json.merge(wishlist_item_id: item.id)
    }
  end

  # POST /wishlist
  def create
    product = Product.find(params[:product_id])
    wishlist_item = current_user.wishlist_items.new(product: product)

    if wishlist_item.save
      render json: wishlist_item, status: :created
    else
      render json: { errors: wishlist_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /wishlist/:id
  def destroy
    wishlist_item = current_user.wishlist_items.find(params[:id])
    wishlist_item.destroy
    head :no_content
  end
end
