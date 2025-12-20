# db/seeds.rb (Final Solution using DummyJSON)
require 'net/http'
require 'json'

puts "Seeding product catalog with RELIABLE data from DummyJSON..."

Product.transaction do
  # 0. Clean slate
  puts "Cleaning old products..."
  OrderItem.destroy_all
  CartItem.destroy_all
  Product.destroy_all

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
end
