class CreateOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :orders do |t|
      t.references :user, foreign_key: true, null: true
      t.decimal :total_price, precision: 12, scale: 2
      t.string :status, default: "pending"  # pending, paid, shipped, cancelled
      t.text :address

      t.timestamps
    end
  end
end
