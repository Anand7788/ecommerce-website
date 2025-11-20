class CreateCarts < ActiveRecord::Migration[6.1]
  def change
    create_table :carts do |t|
      t.references :user, foreign_key: true, null: true
      t.string :status, default: "open"   # open, ordered, abandoned

      t.timestamps
    end
  end
end
