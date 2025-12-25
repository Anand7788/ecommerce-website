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
      updated_count = 0
      errors = []

      begin
        CSV.foreach(file.path, headers: true) do |row|
          # Skip empty rows
          next if row.to_h.values.all?(&:nil?)

          # 1. Extract attributes correctly
          # We purposefully check .present? to allow "Partial Updates"
          # (e.g. uploading a CSV with just SKU and Price will only update Price)
          attrs = {}
          attrs[:name]        = row['name']        if row['name'].present?
          attrs[:description] = row['description'] if row['description'].present?
          attrs[:category]    = row['category']    if row['category'].present?
          attrs[:image_url]   = row['image_url']   if row['image_url'].present?
          attrs[:stock]       = row['stock']       if row['stock'].present?
          
          if row['price'].present?
            attrs[:price_cents] = (row['price'].to_f * 100).to_i
          end

          sku = row['sku'].presence

          # 2. Find existing product by SKU
          product = Product.find_by(sku: sku) if sku

          if product
            # UPDATE existing
            if product.update(attrs)
              updated_count += 1
            else
              errors << "Row #{$.} (SKU #{sku}): #{product.errors.full_messages.join(', ')}"
            end
          else
            # CREATE new
            # For creation, we need specific defaults or valid data.
            # If SKU was missing, generate one
            attrs[:sku] = sku || "SKU-#{SecureRandom.hex(4)}"
            
            new_product = Product.new(attrs)
            if new_product.save
              created_count += 1
            else
              errors << "Row #{$.}: #{new_product.errors.full_messages.join(', ')}"
            end
          end
        end

        # 3. Construct result message
        summary = []
        summary << "Created #{created_count}" if created_count > 0
        summary << "Updated #{updated_count}" if updated_count > 0
        message = summary.any? ? "Import Complete: #{summary.join(', ')}" : "No products processed"

        render json: { message: message, errors: errors }
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
        :name, :title, :description, :price, :price_cents, :sku, :stock, :image_url, :category
      )
    end
  end
end
