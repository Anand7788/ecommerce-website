class AddFieldsToProducts < ActiveRecord::Migration[8.1]
  def change
    add_column :products, :name, :string unless column_exists?(:products, :name)
    add_column :products, :price_cents, :integer, default: 0, null: false unless column_exists?(:products, :price_cents)
    add_column :products, :description, :text unless column_exists?(:products, :description)
    add_column :products, :sku, :string unless column_exists?(:products, :sku)
    add_column :products, :stock, :integer, default: 0, null: false unless column_exists?(:products, :stock)
    add_column :products, :image_url, :string unless column_exists?(:products, :image_url)
    add_index :products, :sku, unique: true unless index_exists?(:products, :sku)
  end
end
