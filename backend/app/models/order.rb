class Order < ApplicationRecord
  belongs_to :user, optional: true
  has_many :order_items, dependent: :destroy
  has_many :order_status_logs, dependent: :destroy

  # Status Enum
  # pending: Order placed, not yet processed
  # processing: Packed and ready to ship
  # shipped: Handed to courier
  # out_for_delivery: With delivery agent
  # delivered: Successfully delivered
  # cancelled: Order cancelled
  enum :status, { 
    pending: 'pending', 
    processing: 'processing', 
    shipped: 'shipped', 
    out_for_delivery: 'out_for_delivery', 
    delivered: 'delivered', 
    cancelled: 'cancelled',
    returned: 'returned'
  }, default: 'pending', validate: true

  def calculate_total!
    update(total_price: order_items.sum('price * quantity'))
  end
end
