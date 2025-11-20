class AddGuestTokenToCarts < ActiveRecord::Migration[8.1]
  def change
    add_column :carts, :guest_token, :string
    add_index :carts, :guest_token
  end
end
