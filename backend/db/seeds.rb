# db/seeds.rb (idempotent) — creates 20 products by SKU (no destructive deletes)

puts "Seeding products (idempotent)..."

Product.transaction do
  earphones = [
    { name: "EchoBass Earbuds", sku: "EAR-001", description: "True wireless earbuds with deep bass", price: 1299.0, price_cents: 129900, stock: 150, image_url: "https://m.media-amazon.com/images/I/61IwQUCvgvL.jpg" },
    { name: "ClearTone In-Ear", sku: "EAR-002", description: "Wired in-ear earphones with mic", price: 399.0, price_cents: 39900, stock: 200, image_url: "https://cdn.shopify.com/s/files/1/0906/7724/8281/files/alpine-cleartone-earplugs-mica-banner-everyday-use.jpg?v=1735351058" },
    { name: "ActiveSport Buds", sku: "EAR-003", description: "Sweatproof sport earbuds with secure fit", price: 1699.0, price_cents: 169900, stock: 80, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAm1huTU2Ms2ZMrH_SLibgTvwKwSePl_0bdg&s" },
    { name: "StudioPro ANC", sku: "EAR-004", description: "Over-ear ANC headphones for studio sound", price: 3999.0, price_cents: 399900, stock: 40, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFZDlJ1fyWMFOxysZ_gjO40ThgYzRdQ0WxCg&s" },
    { name: "PocketMini Wireless", sku: "EAR-005", description: "Compact true-wireless earbuds with long battery", price: 999.0, price_cents: 99900, stock: 120, image_url: "https://sc04.alicdn.com/kf/H23942c6207384628b90002c04f01babft.jpg" }
  ]

  mobiles = [
    { name: "Nova X1", sku: "MOB-001", description: "Nova X1 - 6.5\" AMOLED, 8GB RAM", price: 14999.0, price_cents: 1499900, stock: 50, image_url: "https://i.ytimg.com/vi/pdZ25y1ROkc/sddefault.jpg" },
    { name: "Edge Pro 5G", sku: "MOB-002", description: "Edge Pro 5G - 120Hz display, 128GB", price: 24999.0, price_cents: 2499900, stock: 30, image_url: "https://gogizmo.in/wp-content/uploads/2024/11/Motorola-Edge-50-Pro-Black-Beauty-3.png" },
    { name: "Zenith Lite", sku: "MOB-003", description: "Zenith Lite - Lightweight with long battery", price: 11999.0, price_cents: 1199900, stock: 70, image_url: "https://m.media-amazon.com/images/I/81R1J+d8O7L.jpg" },
    { name: "Aurora Max", sku: "MOB-004", description: "Aurora Max - Flagship camera performance", price: 39999.0, price_cents: 3999900, stock: 15, image_url: "https://www.jiomart.com/images/product/original/491667256/redmi-note-9-pro-max-64-gb-6-gb-ram-aurora-blue-smartphone-digital-o491667256-p590038039-4-202009260544.jpeg?im=Resize=(420,420)" },
    { name: "Orbit S", sku: "MOB-005", description: "Orbit S - Value for money with clean UI", price: 8999.0, price_cents: 899900, stock: 100, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEI4bUxWfG_Wdq8vXGTHNLIeJkFc4_Lod_A&s" }
  ]

  cases = [
    { name: "Nova X1 Rugged Case", sku: "CASE-MOB001-001", for_sku: "MOB-001", description: "Shockproof rugged case for Nova X1", price: 599.0, price_cents: 59900, stock: 200, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVkHUn8dI_FdfaKvKdMhXyvUHDOKq0jPKkeA&s" },
    { name: "Edge Pro Slim Case", sku: "CASE-MOB002-001", for_sku: "MOB-002", description: "Slim protective case for Edge Pro 5G", price: 499.0, price_cents: 49900, stock: 150, image_url: "https://m.media-amazon.com/images/I/51SAuaaomuL._AC_UF1000,1000_QL80_.jpg" },
    { name: "Zenith Silicone Case", sku: "CASE-MOB003-001", for_sku: "MOB-003", description: "Soft silicone case for Zenith Lite", price: 349.0, price_cents: 34900, stock: 180, image_url: "https://m.media-amazon.com/images/I/81HSN+Y-QgL._AC_UF350,350_QL80_.jpg" },
    { name: "Aurora Leather Case", sku: "CASE-MOB004-001", for_sku: "MOB-004", description: "Premium leather-style case for Aurora Max", price: 799.0, price_cents: 79900, stock: 60, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZpAJxCxAhei_Uq2N59W73dSugEubF2UJ4LA&s" },
    { name: "Orbit S Transparent Case", sku: "CASE-MOB005-001", for_sku: "MOB-005", description: "Clear case for Orbit S", price: 299.0, price_cents: 29900, stock: 220, image_url: "https://m.media-amazon.com/images/I/51lp2oUJ57L._AC_UF1000,1000_QL80_.jpg" }
  ]

  chargers = [
    { name: "Nova X1 Fast Charger 33W", sku: "CHR-MOB001-001", for_sku: "MOB-001", description: "33W fast charger for Nova X1", price: 799.0, price_cents: 79900, stock: 120, image_url: "https://m.media-amazon.com/images/I/4128jrhFylL._AC_UF350,350_QL50_.jpg" },
    { name: "Edge Pro 65W Charger", sku: "CHR-MOB002-001", for_sku: "MOB-002", description: "65W high-speed charger for Edge Pro 5G", price: 1499.0, price_cents: 149900, stock: 80, image_url: "https://m.media-amazon.com/images/I/61-JicAdlUL._UF1000,1000_QL80_.jpg" }
  ]

  cables = [
    { name: "Nova X1 Type-C Cable 1m", sku: "CBL-MOB001-001", for_sku: "MOB-001", description: "Durable Type-C cable (1m) for Nova X1", price: 199.0, price_cents: 19900, stock: 250, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDYRevHz5Qfaj7R7kNDl118hWnh66667i5A&s" },
    { name: "Zenith Lite Braided Cable 2m", sku: "CBL-MOB003-001", for_sku: "MOB-003", description: "Braided Type-C cable (2m) for Zenith Lite", price: 299.0, price_cents: 29900, stock: 180, image_url: "https://m.media-amazon.com/images/I/51rBn99hV1L.jpg" },
    { name: "Orbit S Fast Sync Cable", sku: "CBL-MOB005-001", for_sku: "MOB-005", description: "Fast sync cable for Orbit S", price: 249.0, price_cents: 24900, stock: 200, image_url: "https://m.media-amazon.com/images/I/51NfuFkDa0L._AC_UF1000,1000_QL80_.jpg" }
  ]

  # helper to create or update product by sku
  add_or_update = ->(attrs) do
    sku = attrs[:sku]
    p = Product.find_or_initialize_by(sku: sku)
    p.name = attrs[:name]
    p.title = attrs[:title] || attrs[:name]
    p.description = attrs[:description]
    p.price = attrs[:price]
    p.price_cents = attrs[:price_cents] || (attrs[:price] ? (attrs[:price] * 100).to_i : nil)
    p.stock = attrs[:stock]
    p.image_url = attrs[:image_url]
    p.save!
    p
  end

  earphones.each { |h| add_or_update.call(h) }
  mobiles.each { |h| add_or_update.call(h) }

  # create accessory products
  cases.each { |h| add_or_update.call(h.except(:for_sku)) }
  chargers.each { |h| add_or_update.call(h.except(:for_sku)) }
  cables.each { |h| add_or_update.call(h.except(:for_sku)) }

  puts "Seeding complete. Total products: #{Product.count}"
end
