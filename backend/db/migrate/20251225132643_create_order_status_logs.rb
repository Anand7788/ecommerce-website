class CreateOrderStatusLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :order_status_logs do |t|
      t.references :order, null: false, foreign_key: true
      t.string :status
      t.text :notes

      t.timestamps
    end
  end
end
