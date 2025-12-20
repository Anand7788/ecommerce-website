class AddressesController < ApplicationController
  before_action :authenticate_user!

  # GET /addresses
  def index
    render json: current_user.addresses
  end

  # POST /addresses
  def create
    address = current_user.addresses.new(address_params)
    if address.save
      # If default, unset others
      if address.is_default
        current_user.addresses.where.not(id: address.id).update_all(is_default: false)
      end
      render json: address, status: :created
    else
      render json: { errors: address.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /addresses/:id
  def update
    address = current_user.addresses.find(params[:id])
    if address.update(address_params)
      if address.is_default
        current_user.addresses.where.not(id: address.id).update_all(is_default: false)
      end
      render json: address
    else
      render json: { errors: address.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /addresses/:id
  def destroy
    address = current_user.addresses.find(params[:id])
    address.destroy
    render json: { message: 'Address deleted' }
  end

  private

  def address_params
    params.require(:address).permit(:name, :street, :city, :zip, :mobile, :is_default)
  end
end
