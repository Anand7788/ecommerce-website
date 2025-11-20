class Order < ApplicationRecord
  belongs_to :user, optional: true
  has_many :order_items, dependent: :destroy

  def calculate_total!
    update(total_price: order_items.sum('price * quantity'))
  end
end
