# app/controllers/admin/products_controller.rb
module Admin
  require 'csv'

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

    # POST /admin/product_bulk_import
    def import_csv
      file = params[:file]
      return render json: { error: 'No file uploaded' }, status: :bad_request unless file

      created_count = 0
      errors = []

      begin
        CSV.foreach(file.path, headers: true) do |row|
          # Skip empty rows
          next if row.to_h.values.all?(&:nil?)

          product = Product.new(
            name: row['name'],
            price_cents: (row['price'].to_f * 100).to_i, # Convert decimal price to cents
            description: row['description'],
            image_url: row['image_url'],
            category: row['category'],
            stock: row['stock'] || 0,
            sku: row['sku'] || "SKU-#{SecureRandom.hex(4)}" # Fallback SKU generation
          )
          
          if product.save
            created_count += 1
          else
            errors << "Row #{$.}: #{product.errors.full_messages.join(', ')}"
          end
        end

        render json: { message: "Imported #{created_count} products", errors: errors }
      rescue => e
        render json: { error: "CSV Error: #{e.message}" }, status: :unprocessable_entity
      end
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
