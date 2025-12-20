class CreateAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :street
      t.string :city
      t.string :zip
      t.string :mobile
      t.boolean :is_default

      t.timestamps
    end
  end
end
