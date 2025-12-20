class PasswordsController < ApplicationController
  # PATCH /passwords/update
  # Requires authentication (handled by frontend sending token, backend finds user)
  
  def update
    # In a real app, you would have a `current_user` helper from a `authenticate_request` before_action
    # Here we will decode the token manually since we moved fast earlier
    
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base)[0]
      user_id = decoded['user_id']
      @current_user = User.find(user_id)
    rescue JWT::DecodeError
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    unless @current_user.authenticate(params[:current_password])
      return render json: { error: 'Current password is incorrect.' }, status: :unauthorized
    end

    if @current_user.update(password: params[:new_password])
      render json: { message: "Password updated successfully." }, status: :ok
    else
      render json: { error: @current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
