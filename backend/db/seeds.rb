# db/seeds.rb (idempotent)
puts "Seeding extended product catalog..."

Product.transaction do
  # Helper to create/update
  add_or_update = ->(attrs) do
    sku = attrs[:sku]
    p = Product.find_or_initialize_by(sku: sku)
    p.name = attrs[:name]
    p.description = attrs[:description]
    p.category = attrs[:category]
    p.price = attrs[:price]
    p.price_cents = (attrs[:price] * 100).to_i
    p.stock = attrs[:stock] || 50
    p.image_url = attrs[:image_url]
    p.save!
  end

  # ==========================================
  # 1. Electronics (Audio, Peripherals, Cameras)
  # ==========================================
  [
    { 
      name: "AirPod Max Style Headphones", sku: "AUD-001", category: "Electronics",
      description: "Premium over-ear noise cancelling headphones with spatial audio.",
      price: 15999.0, image_url: "https://m.media-amazon.com/images/I/61IwQUCvgvL.jpg" 
    },
    { 
      name: "Sony XM4 Noise Cancelling", sku: "AUD-002", category: "Electronics",
      description: "Industry leading noise cancellation with 30hr battery life.",
      price: 24990.0, image_url: "https://m.media-amazon.com/images/I/51SkO+4JkKL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "JBL Flip 5 Bluetooth Speaker", sku: "AUD-003", category: "Electronics",
      description: "Waterproof portable bluetooth speaker with powerful bass.",
      price: 8999.0, image_url: "https://m.media-amazon.com/images/I/719CLc+IqfL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Marshall Acton II Speaker", sku: "AUD-004", category: "Electronics",
      description: "Classic design, powerful room-filling sound.",
      price: 24999.0, image_url: "https://m.media-amazon.com/images/I/71N-E-rZ+AL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Logitech MX Master 3S", sku: "PER-001", category: "Electronics",
      description: "Performance wireless mouse max precision.",
      price: 9500.0, image_url: "https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Keychron K2 Mechanical Keyboard", sku: "PER-002", category: "Electronics",
      description: "Wireless mechanical keyboard for Mac and Windows.",
      price: 8499.0, image_url: "https://m.media-amazon.com/images/I/61M25yHAECL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "GoPro Hero 12 Black", sku: "CAM-001", category: "Electronics",
      description: "Action camera with 5.3K60 video and HyperSmooth 6.0.",
      price: 39990.0, image_url: "https://m.media-amazon.com/images/I/5155+T3tHUL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Fujifilm Instax Mini 12", sku: "CAM-002", category: "Electronics",
      description: "Compact instant camera with automatic exposure.",
      price: 6499.0, image_url: "https://m.media-amazon.com/images/I/61m1J1+48hL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Sony PlayStation 5 Slim", sku: "GAM-001", category: "Electronics",
      description: "Next-gen gaming console with 1TB SSD.",
      price: 54990.0, image_url: "https://m.media-amazon.com/images/I/51051FiD9UL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Xbox Series X", sku: "GAM-002", category: "Electronics",
      description: "Power your dreams with 12 teraflops of processing power.",
      price: 49990.0, image_url: "https://m.media-amazon.com/images/I/61-jjE67uqL._AC_UF1000,1000_QL80_.jpg" 
    }
  ].each { |h| add_or_update.call(h) }

  # ==========================================
  # 2. Mobiles (Smartphones)
  # ==========================================
  [
    { 
      name: "iPhone 15 Pro", sku: "MOB-101", category: "Mobile",
      description: "Titanium design, A17 Pro chip, 48MP Main Camera.",
      price: 134900.0, image_url: "https://m.media-amazon.com/images/I/81+GIkwqLIL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Samsung Galaxy S24 Ultra", sku: "MOB-102", category: "Mobile",
      description: "Galaxy AI is here. 200MP camera, titanium frame.",
      price: 129999.0, image_url: "https://m.media-amazon.com/images/I/71Hx8b6HOSL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "OnePlus 12", sku: "MOB-103", category: "Mobile",
      description: "Smooth beyond belief. Snapdragon 8 Gen 3.",
      price: 64999.0, image_url: "https://m.media-amazon.com/images/I/717Qo4MH97L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Google Pixel 8 Pro", sku: "MOB-104", category: "Mobile",
      description: "The most pro Pixel ever with Gemini Nano.",
      price: 99999.0, image_url: "https://m.media-amazon.com/images/I/61f47G-WQwL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Nothing Phone (2)", sku: "MOB-105", category: "Mobile",
      description: "Iconic Glyph interface, new Nothing OS.",
      price: 39999.0, image_url: "https://m.media-amazon.com/images/I/715M3Q8cVAL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Xiaomi 14", sku: "MOB-106", category: "Mobile",
      description: "Co-engineered with Leica. Compact flagship.",
      price: 69999.0, image_url: "https://m.media-amazon.com/images/I/71g08x+rT+L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Samsung Galaxy Z Flip 5", sku: "MOB-107", category: "Mobile",
      description: "Join the flip side. Pocket sized foldable.",
      price: 99999.0, image_url: "https://m.media-amazon.com/images/I/71O+l8+r+5L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Realme 12 Pro+", sku: "MOB-108", category: "Mobile",
      description: "Periscope portrait camera master.",
      price: 29999.0, image_url: "https://m.media-amazon.com/images/I/71c1t7h1G+L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Poco X6 Pro", sku: "MOB-109", category: "Mobile",
      description: "The speed-cies. Dimensity 8300 Ultra.",
      price: 26999.0, image_url: "https://m.media-amazon.com/images/I/51A+-M7WplL._AC_UF1000,1000_QL80_.jpg" 
    },
     { 
      name: "Motorola Edge 50 Pro", sku: "MOB-110", category: "Mobile",
      description: "Intelligence meets art. 144Hz pOLED.",
      price: 31999.0, image_url: "https://gogizmo.in/wp-content/uploads/2024/11/Motorola-Edge-50-Pro-Black-Beauty-3.png" 
    }
  ].each { |h| add_or_update.call(h) }

  # ==========================================
  # 3. Appliances (Home & Kitchen)
  # ==========================================
  [
    { 
      name: "Dyson V12 Detect Slim", sku: "APP-001", category: "Appliances",
      description: "Intelligent cordless vacuum with laser detect.",
      price: 45900.0, image_url: "https://m.media-amazon.com/images/I/61w4W3y2VUL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Philips Air Fryer XL", sku: "APP-002", category: "Appliances",
      description: "Great tasting fries with up to 90% less fat.",
      price: 12990.0, image_url: "https://m.media-amazon.com/images/I/71Y-C6A7cZL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Nespresso Coffee Machine", sku: "APP-003", category: "Appliances",
      description: "Barista style coffee at home with one touch.",
      price: 18500.0, image_url: "https://m.media-amazon.com/images/I/61JImD5p0gL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Roborock S8 Robot Vacuum", sku: "APP-004", category: "Appliances",
      description: "Robot vacuum and mop with sonic mopping.",
      price: 59999.0, image_url: "https://m.media-amazon.com/images/I/51H6kP23PQL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "KitchenAid Stand Mixer", sku: "APP-005", category: "Appliances",
      description: "Artisan series 5-quart tilt-head stand mixer.",
      price: 39999.0, image_url: "https://m.media-amazon.com/images/I/71K+fL-rT+L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "NutriBullet Pro Blender", sku: "APP-006", category: "Appliances",
      description: "High-speed blender/mixer system.",
      price: 8999.0, image_url: "https://m.media-amazon.com/images/I/71yR+c-9lQL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Dyson Airwrap Multi-Styler", sku: "APP-007", category: "Appliances",
      description: "Curl. Shape. Smooth and hide flyaways.",
      price: 45900.0, image_url: "https://m.media-amazon.com/images/I/61M+C-v9u1L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Philips Steam Iron", sku: "APP-008", category: "Appliances",
      description: "EasySpeed Plus steam iron with non-stick soleplate.",
      price: 1499.0, image_url: "https://m.media-amazon.com/images/I/61y+1+t+M+L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Mi Smart Air Purifier 4", sku: "APP-009", category: "Appliances",
      description: "Breathe clean, breathe healthy. OLED display.",
      price: 14999.0, image_url: "https://m.media-amazon.com/images/I/51F8+1+l+L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      name: "Kent RO Water Purifier", sku: "APP-010", category: "Appliances",
      description: "Grand+ RO+UV+UF+TDS Control water purifier.",
      price: 15999.0, image_url: "https://m.media-amazon.com/images/I/61y8+1+M+L._AC_UF1000,1000_QL80_.jpg" 
    }
  ].each { |h| add_or_update.call(h) }

  # ==========================================
  # 4. Fashion (Clothing, Watches, Bags)
  # ==========================================
  [
    { 
      name: "Nike Air Jordan 1 High", sku: "FAS-001", category: "Fashion",
      description: "Classic basketball sneakers in red and black.",
      price: 16995.0, image_url: "https://m.media-amazon.com/images/I/61scZ4WjHIL._AC_UY1000_.jpg" 
    },
    { 
      name: "Casio G-Shock GA-2100", sku: "FAS-002", category: "Fashion",
      description: "The 'CasiOak' octagonal analog-digital watch.",
      price: 9995.0, image_url: "https://m.media-amazon.com/images/I/61Xz7C-sB5L._AC_UY1000_.jpg" 
    },
    { 
      name: "Ray-Ban Aviator Sunglasses", sku: "FAS-003", category: "Fashion",
      description: "Classic gold frame aviator sunglasses.",
      price: 8500.0, image_url: "https://m.media-amazon.com/images/I/519fT+wT0HL._AC_UY1000_.jpg" 
    },
    { 
      name: "Levis 501 Original Jeans", sku: "FAS-004", category: "Fashion",
      description: "The original straight fit blue pair of jeans.",
      price: 3999.0, image_url: "https://m.media-amazon.com/images/I/61+D0Xo0qdL._AC_UY1000_.jpg" 
    },
    { 
      name: "Adidas Originals Hoodie", sku: "FAS-005", category: "Fashion",
      description: "Classic trefoil hoodie in black.",
      price: 4999.0, image_url: "https://m.media-amazon.com/images/I/51+9+w+L._AC_UY1000_.jpg" 
    },
    { 
      name: "Tommy Hilfiger Backpack", sku: "FAS-006", category: "Fashion",
      description: "Navy blue laptop backpack for daily commute.",
      price: 3499.0, image_url: "https://m.media-amazon.com/images/I/81+G+w+L._AC_UY1000_.jpg" 
    },
    { 
      name: "Puma Scuderia Ferrari Cap", sku: "FAS-007", category: "Fashion",
      description: "Red motorsport cap for racing fans.",
      price: 1999.0, image_url: "https://m.media-amazon.com/images/I/61+R+w+L._AC_UY1000_.jpg" 
    },
    { 
      name: "Fossil Gen 6 Smartwatch", sku: "FAS-008", category: "Fashion",
      description: "Touchscreen smartwatch with Alexa built-in.",
      price: 18995.0, image_url: "https://m.media-amazon.com/images/I/61+x+q+L._AC_UY1000_.jpg" 
    },
    { 
      name: "H&M Regular Fit Shirt", sku: "FAS-009", category: "Fashion",
      description: "Crisp white cotton shirt for office wear.",
      price: 1299.0, image_url: "https://m.media-amazon.com/images/I/71+j+L+AC_UY1000_.jpg" 
    },
    { 
      name: "Zara Leather Jacket", sku: "FAS-010", category: "Fashion",
      description: "Faux leather jacket with biker details.",
      price: 5990.0, image_url: "https://m.media-amazon.com/images/I/71+L+AC_UY1000_.jpg" 
    }
  ].each { |h| add_or_update.call(h) }

  puts "Seeding complete. Total products: #{Product.count}"
end
