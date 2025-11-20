class CreateCartItems < ActiveRecord::Migration[6.1]
  def change
    create_table :cart_items do |t|
      t.references :cart, foreign_key: true
      t.references :product, foreign_key: true
      t.integer :quantity, default: 1, null: false
      t.decimal :price, precision: 10, scale: 2  # snapshot of product price

      t.timestamps
    end
  end
end
