class Address < ApplicationRecord
  belongs_to :user
  validates :name, :street, :city, :zip, presence: true
  validates :mobile, presence: true, length: { is: 10 }, format: { with: /\A\d{10}\z/, message: "must be 10 digits" }
  validates :street, uniqueness: { scope: [:user_id, :city, :zip, :name, :mobile], message: "already exists for this user" }
end
