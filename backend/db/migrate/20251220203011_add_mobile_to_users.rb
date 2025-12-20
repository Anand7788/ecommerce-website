class AddMobileToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :mobile, :string
  end
end
