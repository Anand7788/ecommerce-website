module Admin
  class ReviewsController < ApplicationController
    before_action :authenticate_admin!

    def index
      # Fetch all reviews, including associated user and product data
      reviews = Review.includes(:user, :product).order(created_at: :desc)
      
      render json: reviews.map { |r|
        # Attempt to find the order associated with this review
        order = Order.joins(:order_items)
                     .where(user_id: r.user.id)
                     .where(order_items: { product_id: r.product.id })
                     .order(created_at: :desc)
                     .first

        order_name = nil
        order_mobile = nil

        if order&.address.present?
          # Address format from Checkout.jsx: "Name, Street, City, Zip (Mobile: 1234567890)"
          # Name is before the first comma
          order_name = order.address.split(',').first.strip rescue nil
          
          # Mobile is captured in (Mobile: X)
          mobile_match = order.address.match(/\(Mobile:\s*(\d+)\)/)
          order_mobile = mobile_match[1] if mobile_match
        end

        # Fallback priority: Order > User Profile > Address Book > Default
        final_name = order_name.presence || r.user.name.presence || r.user.addresses.order(created_at: :desc).first&.name || "Guest User"
        final_mobile = order_mobile.presence || r.user.mobile.presence || r.user.addresses.order(created_at: :desc).where.not(mobile: [nil, ""]).first&.mobile

        {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          user: {
            id: r.user.id,
            name: final_name,
            email: r.user.email,
            mobile: final_mobile
          },
          product: {
            id: r.product.id,
            name: r.product.name,
            image_url: r.product.image_url
          }
        }
      }
    end

    def destroy
      review = Review.find(params[:id])
      review.destroy
      head :no_content
    end


  end
end
