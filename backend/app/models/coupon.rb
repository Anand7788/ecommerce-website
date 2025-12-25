class Coupon < ApplicationRecord
  validates :code, presence: true, uniqueness: true
  validates :discount_value, numericality: { greater_than: 0 }
  validates :min_order_amount, numericality: { greater_than_or_equal_to: 0 }

  before_save { self.code = code.upcase }
end
