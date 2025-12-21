class UsersController < ApplicationController
  # POST /signup
  def create
    user = User.new(user_params)
    if user.save
      token = encode_token({ user_id: user.id })
      render json: { user: user.as_json(only: [:id, :name, :email, :mobile]), token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /me - Get current user profile
  def show
    authenticate_user!
    return if performed?
    render json: current_user.as_json(only: [:id, :name, :email, :mobile])
  end

  # PATCH /me - Update profile
  def update
    authenticate_user!
    return if performed?
    
    if current_user.update(user_update_params)
      render json: { message: 'Profile updated', user: current_user.as_json(only: [:id, :name, :email, :mobile]) }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /check_email - Check if user exists
  def check_email
    user = User.find_by(email: params[:email])
    if user
      render json: { exists: true }
    else
      render json: { exists: false }
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :mobile)
  end

  def user_update_params
    params.require(:user).permit(:name, :email, :mobile)
  end
end
