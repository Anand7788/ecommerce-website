class CreateOrderItems < ActiveRecord::Migration[6.1]
  def change
    create_table :order_items do |t|
      t.references :order, foreign_key: true
      t.references :product, foreign_key: true
      t.integer :quantity, default: 1, null: false
      t.decimal :price, precision: 10, scale: 2

      t.timestamps
    end
  end
end
