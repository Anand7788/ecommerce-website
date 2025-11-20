# app/controllers/admin/products_controller.rb
module Admin
  class ProductsController < ApplicationController
    before_action :authenticate_user!        # ensure logged in
    before_action :authenticate_admin!       # ensure admin
    before_action :set_product, only: [:show, :update, :destroy]

    # GET /admin/products
    def index
      products = Product.order(:id)
      render json: products
    end

    # GET /admin/products/:id
    def show
      render json: @product
    end

    # POST /admin/products
    def create
      product = Product.new(product_params)
      if product.save
        render json: product, status: :created
      else
        render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /admin/products/:id
    def update
      if @product.update(product_params)
        render json: @product
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /admin/products/:id
    def destroy
      @product.destroy
      head :no_content
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.require(:product).permit(
        :name, :title, :description, :price, :price_cents, :sku, :stock, :image_url
      )
    end
  end
end
