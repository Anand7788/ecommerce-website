# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  # Generic JSON error handler
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from StandardError, with: :internal_error

  private

  # -------------------------
  # Error handlers
  # -------------------------
  def record_not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def internal_error(exception)
    # Do not leak exception details in production; helpful for dev
    render json: { error: "Internal Server Error", details: exception.message }, status: :internal_server_error
  end

  # -------------------------
  # JWT auth helpers
  # -------------------------
  # Secret: prefer ENV['JWT_SECRET'] or credentials. Fallback to a non-secret string (change for prod).
  SECRET_KEY = ENV['JWT_SECRET'].presence || Rails.application.credentials.jwt_secret || 'please_change_me'

  # Create a token with expiry (default 24 hours)
  def encode_token(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  # Returns decoded payload hash or nil
  def decoded_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header.present? && auth_header.start_with?('Bearer ')
    token = auth_header.split(' ').last
    begin
      decoded = JWT.decode(token, SECRET_KEY, true, algorithm: 'HS256')
      decoded.first # payload
    rescue JWT::DecodeError, JWT::ExpiredSignature => e
      nil
    end
  end

  # Loads current_user lazily
  def current_user
    return @current_user if defined?(@current_user)
    payload = decoded_token
    @current_user = payload && payload['user_id'] ? User.find_by(id: payload['user_id']) : nil
  end

  # Use in controllers where auth required
  def authenticate_user!
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  end

  # -------------------------
  # Anonymous cart token helpers
  # -------------------------
  # We allow anonymous carts by passing a Cart-Token header or cart_token param.
  # Frontend should persist and send Cart-Token for anonymous users.
  def find_or_create_anonymous_cart
    token = request.headers['Cart-Token'].presence || params[:cart_token].presence
    if token
      cart = Cart.find_by(guest_token: token, status: 'open')
      return cart if cart
    end

    # create new anonymous cart with guest_token and return it
    guest_token = SecureRandom.uuid
    cart = Cart.create!(guest_token: guest_token, status: 'open')
    # include token in response headers so client can persist it
    response.set_header('Cart-Token', guest_token)
    cart
  end
end

# authenticate_admin! method to be used in controllers where admin access is required
def authenticate_admin!
  unless current_user&.admin?
    render json: { error: "Forbidden — admin only" }, status: :forbidden
  end
end

