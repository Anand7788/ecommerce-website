class PasswordResetsController < ApplicationController
  # POST /password_resets check email and generate token
  def create
    user = User.find_by(email: params[:email])
    if user
      user.generate_password_reset_token!
      # MOCK EMAIL SENDING
      # In a real app, UserMailer.password_reset(user).deliver_now
      puts "----------------------------------------"
      puts " PASSWORD RESET LINK (MOCK):"
      puts " http://localhost:5173/reset-password?token=#{user.reset_password_token}&email=#{user.email}"
      puts "----------------------------------------"
      render json: { message: "If an account with that email exists, we have sent a reset link.", db_token_mock: user.reset_password_token }, status: :ok
    else
      # Return ok anyway to prevent email enumeration
      render json: { message: "If an account with that email exists, we have sent a reset link." }, status: :ok
    end
  end

  # POST /password_resets/reset verify token and update
  def update
    user = User.find_by(reset_password_token: params[:token])
    
    if user && user.password_token_valid?
      if user.reset_password!(params[:password])
        render json: { message: "Password has been reset successfully." }, status: :ok
      else
        render json: { error: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: "Link not valid or expired. Try generating a new link." }, status: :not_found
    end
  end
end
