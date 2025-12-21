# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://shopnow-web.netlify.app',
            'https://shopnow-web.netlify.com'

    resource '*',
      headers: :any,
      expose: ['Cart-Token'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
