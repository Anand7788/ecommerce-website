# app/models/product.rb
class Product < ApplicationRecord
  validates :name, presence: true
  validates :price_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :sku, uniqueness: true, allow_blank: true

  # helper for JSON clients
  def price
    price_cents.to_f / 100.0
  end

  def price=(value)
    self.price_cents = (value.to_f * 100).to_i
  end

  def as_json(options = {})
    super({ only: [:id, :name, :description, :sku, :stock, :image_url, :category, :created_at, :updated_at] }.merge(options)).merge("price" => price)
  end
end
