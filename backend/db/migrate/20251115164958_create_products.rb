# db/migrate/20251115164958_create_products.rb
class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string  :name,        null: false
      t.integer :price_cents, null: false, default: 0
      t.text    :description
      t.string  :sku
      t.integer :stock,       null: false, default: 0
      t.string  :image_url

      t.timestamps
    end

    add_index :products, :sku, unique: true
  end
end
