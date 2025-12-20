# db/seeds.rb (idempotent)
puts "Seeding products..."

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
    # print "."
  end

  # 1. Electronics (Headphones / Audio)
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
      name: "Logitech MX Master 3S Mouse", sku: "ACC-001", category: "Electronics",
      description: "Performance wireless mouse max precision.",
      price: 9500.0, image_url: "https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_UF1000,1000_QL80_.jpg" 
    },
  ].each { |h| add_or_update.call(h) }

  # 2. Mobiles
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
    }
  ].each { |h| add_or_update.call(h) }

  # 3. Appliances
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
    }
  ].each { |h| add_or_update.call(h) }

  # 4. Fashion
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
    }
  ].each { |h| add_or_update.call(h) }

  puts "Seeding complete. Total products: #{Product.count}"
end
