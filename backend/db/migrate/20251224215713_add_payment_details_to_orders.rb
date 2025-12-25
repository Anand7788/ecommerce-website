class AddPaymentDetailsToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :payment_method, :string
    add_column :orders, :discount_amount, :decimal, precision: 10, scale: 2
    add_column :orders, :coupon_code, :string
  end
end
