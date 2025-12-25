class ReviewsController < ApplicationController
  before_action :authenticate_user!, only: [:create]

  # GET /products/:product_id/reviews
  def index
    product = Product.find(params[:product_id])
    reviews = product.reviews.includes(:user).order(created_at: :desc)
    
    render json: reviews.as_json(include: { user: { only: [:id, :name] } })
  end

  # POST /products/:product_id/reviews
  def create
    product = Product.find(params[:product_id])
    review = product.reviews.new(review_params)
    review.user = current_user

    if review.save
      render json: review, status: :created
    else
      render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def review_params
    params.require(:review).permit(:rating, :comment)
  end
end
