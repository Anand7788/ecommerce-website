require 'net/http'
require 'uri'
require 'json'
require 'openssl'

module Api
  class PaymentsController < ApplicationController


    def create_order
      amount = (params[:amount].to_f * 100).to_i # Razorpay expects amount in paise
      
      # Prepare Razorpay API request
      uri = URI('https://api.razorpay.com/v1/orders')
      req = Net::HTTP::Post.new(uri)
      req.basic_auth(ENV['RAZORPAY_KEY_ID'], ENV['RAZORPAY_KEY_SECRET'])
      req.content_type = 'application/json'
      req.body = JSON.dump({
        amount: amount,
        currency: 'INR',
        receipt: "order_rcptid_#{Time.now.to_i}"
      })

      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      if res.is_a?(Net::HTTPSuccess)
        order = JSON.parse(res.body)
        
        # Log the full response for the user to see
        Rails.logger.info "--- RAZORPAY ORDER RESPONSE ---"
        Rails.logger.info JSON.pretty_generate(order)
        Rails.logger.info "-------------------------------"

        render json: {
          id: order['id'],
          currency: order['currency'],
          amount: order['amount'],
          key_id: ENV['RAZORPAY_KEY_ID'] 
        }
      else
        error_body = JSON.parse(res.body) rescue { error: "Unknown error" }
        render json: { error: error_body['error']['description'] || "Payment initiation failed" }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end

    def verify
      # Manual Signature Verification
      secret = ENV['RAZORPAY_KEY_SECRET']
      data = "#{params[:razorpay_order_id]}|#{params[:razorpay_payment_id]}"
      
      generated_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), secret, data)

      if generated_signature == params[:razorpay_signature]
        Rails.logger.info "✅ PAYMENT VERIFICATION SUCCESSFUL"
        Rails.logger.info "Order ID: #{params[:razorpay_order_id]}"
        
        # Signature is valid
        # Here you would typically find the user's cart and create the actual order in your DB
        # For now, we return success so frontend calls createOrder
        render json: { status: 'ok', message: 'Payment verified' }
      else
        Rails.logger.error "❌ PAYMENT VERIFICATION FAILED"
        Rails.logger.error "Expected: #{generated_signature}"
        Rails.logger.error "Received: #{params[:razorpay_signature]}"
        
        render json: { error: 'Signature verification failed' }, status: :unprocessable_entity
      end
    end
  end
end
