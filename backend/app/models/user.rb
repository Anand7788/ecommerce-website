class User < ApplicationRecord
  has_secure_password

  has_many :carts
  has_many :orders
  has_many :addresses, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :mobile, allow_blank: true, length: { is: 10 }, format: { with: /\A\d{10}\z/, message: "must be 10 digits" }

  def generate_password_reset_token!
    self.reset_password_token = SecureRandom.urlsafe_base64
    self.reset_password_sent_at = Time.current
    save!
  end

  def password_token_valid?
    (reset_password_sent_at + 1.hour) > Time.current
  end

  def reset_password!(new_password)
    self.reset_password_token = nil
    self.password = new_password
    save!
  end
end
