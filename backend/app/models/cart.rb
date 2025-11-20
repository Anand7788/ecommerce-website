class Cart < ApplicationRecord
  belongs_to :user, optional: true
  has_many :cart_items, dependent: :destroy

  def total_price
    cart_items.sum('price * quantity')
  end
end
