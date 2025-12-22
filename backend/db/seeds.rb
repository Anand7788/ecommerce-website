# db/seeds.rb (Final Solution using DummyJSON)
require 'net/http'
require 'json'

puts "Seeding product catalog with RELIABLE data from DummyJSON..."

Product.transaction do
  # 0. Clean slate - DISABLED FOR SAFETY ON PRODUCTION
  # puts "Cleaning old products..."
  # OrderItem.destroy_all
  # CartItem.destroy_all
  # Order.destroy_all
  # Cart.destroy_all # Fix: Remove carts before users
  # Product.destroy_all
  # User.where(admin: false).destroy_all 
  # User.connection.execute("DELETE FROM sqlite_sequence WHERE name='products'")

  # Helper to create/update
  add_or_update = ->(attrs) do
    sku = attrs[:sku]
    p = Product.find_or_initialize_by(sku: sku)
    p.name = attrs[:name]
    p.description = attrs[:description]
    p.category = attrs[:category]
    p.price_cents = (attrs[:price] * 100).to_i
    p.stock = attrs[:stock] || 50
    # Prefer thumbnail for listing, or first image
    p.image_url = attrs[:image_url]
    p.save!
  end

  # Function to fetch and map
  def fetch_and_seed(category_url, app_category, sku_prefix, add_proc, limit=10)
    uri = URI(category_url)
    res = Net::HTTP.get_response(uri)
    if res.is_a?(Net::HTTPSuccess)
      data = JSON.parse(res.body)
      products = data['products'].take(limit)
      
      products.each_with_index do |item, idx|
        add_proc.call({
          name: item['title'],
          sku: "#{sku_prefix}-#{100+idx}",
          category: app_category,
          description: item['description'],
          price: item['price'].to_f * 85, # rough USD->INR conversion if needed, or just use as is. Using * 85 to simulate INR
          stock: item['stock'],
          image_url: item['thumbnail'] # DummyJSON thumbnails are very reliable
        })
      end
      puts "Seeded #{products.size} items for #{app_category}"
    else
      puts "Failed to fetch #{category_url}"
    end
  end

  # 1. Mobile (Smartphones)
  fetch_and_seed('https://dummyjson.com/products/category/smartphones', 'Mobile', 'MOB', add_or_update)

  # 2. Electronics (Laptops, Tablets, Accessories)
  fetch_and_seed('https://dummyjson.com/products/category/laptops', 'Electronics', 'LAP', add_or_update)
  fetch_and_seed('https://dummyjson.com/products/category/tablets', 'Electronics', 'TAB', add_or_update)
  fetch_and_seed('https://dummyjson.com/products/category/mobile-accessories', 'Electronics', 'ACC', add_or_update)

  # 3. Appliances (Home Decor, Kitchen - mapping closely)
  fetch_and_seed('https://dummyjson.com/products/category/kitchen-accessories', 'Appliances', 'APP', add_or_update)
  fetch_and_seed('https://dummyjson.com/products/category/furniture', 'Appliances', 'FUR', add_or_update)


  # 4. Fashion (Mens, Womens, Watches, Shoes)
  fetch_and_seed('https://dummyjson.com/products/category/mens-shirts', 'Fashion', 'FAS-M', add_or_update)
  fetch_and_seed('https://dummyjson.com/products/category/womens-bags', 'Fashion', 'FAS-W', add_or_update)
  fetch_and_seed('https://dummyjson.com/products/category/mens-watches', 'Fashion', 'FAS-WA', add_or_update)
  fetch_and_seed('https://dummyjson.com/products/category/sunglasses', 'Fashion', 'FAS-SUN', add_or_update)
  
  
  puts "Seeding complete. Total products: #{Product.count}"
  
  puts "Seeding complete. Total products: #{Product.count}"
  
  # Create Admin User
  if User.find_by(email: 'anandkumarprasad750@gmail.com').nil?
    User.create!(
      name: 'Admin User',
      email: 'anandkumarprasad750@gmail.com',
      password: 'password',
      admin: true
    )
    puts "Created Admin User: admin@example.com / password"
  end

  # Create Sample Customers and Orders
  if Rails.env.development?
    puts "Creating sample orders..."
    5.times do |i|
      u = User.create!(
        name: "Customer #{i+1}",
        email: "user#{i+1}@example.com",
        password: "password"
      )
      
      # Create 1-3 orders for this user
      rand(1..3).times do
        o = Order.create!(
          user: u,
          status: ['pending', 'shipped', 'delivered'].sample,
          address: "#{100+rand(900)} Main St, City #{i+1}, State, 12345",
          total_price: 0
        )
        
        # Add 2-5 items per order
        all_products = Product.all.to_a
        total = 0
        rand(2..5).times do
          prod = all_products.sample
          qty = rand(1..3)
          price = prod.price_cents / 100.0
          OrderItem.create!(
            order: o,
            product: prod,
            quantity: qty,
            price: price
          )
          total += price * qty
        end
        o.update(total_price: total)
      end
    end
    puts "Created sample customers and orders."
  end
end
