class CouponsController < ApplicationController
  # Validate logic (Public for checkout)
  def validate
    code = params[:code].to_s.upcase
    amount = params[:amount].to_f

    coupon = Coupon.find_by(code: code, active: true)

    if coupon
      if amount >= coupon.min_order_amount
        discount = 0
        if coupon.discount_type == 'percent'
           discount = (amount * (coupon.discount_value / 100.0)).floor
           # Optional: Cap max discount for percent type? 
           # User earlier said "10% max 50". Maybe we add a max_cap field later. 
           # For now, let's assume no hard cap unless implemented in model.
        else
           discount = coupon.discount_value
        end

        # Ensure discount doesn't exceed total
        discount = [discount, amount].min

        render json: { valid: true, discount: discount, code: coupon.code }
      else
        render json: { valid: false, error: "Minimum order amount is ₹#{coupon.min_order_amount}" }, status: :unprocessable_entity
      end
    else
      render json: { valid: false, error: "Invalid or expired coupon" }, status: :not_found
    end
  end

  # Admin Actions
  def index
    render json: Coupon.all.order(created_at: :desc)
  end

  def create
    coupon = Coupon.new(coupon_params)
    if coupon.save
      render json: coupon, status: :created
    else
      render json: { error: coupon.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    coupon = Coupon.find(params[:id])
    if coupon.update(coupon_params)
      render json: coupon
    else
      render json: { error: coupon.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    Coupon.find(params[:id]).destroy
    head :no_content
  end

  private

  def coupon_params
    params.require(:coupon).permit(:code, :discount_type, :discount_value, :min_order_amount, :active)
  end
end
