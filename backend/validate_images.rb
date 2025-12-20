# validate_images.rb
require 'net/http'
require 'uri'

puts "Checking #{Product.count} product images..."
broken_count = 0

Product.find_each do |p|
  begin
    url = URI.parse(p.image_url)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = (url.scheme == "https")
    http.read_timeout = 3
    http.open_timeout = 3
    
    response = http.request_head(url.path.empty? ? "/" : url.path)
    
    if response.code.to_i >= 400
      puts "[BROKEN] #{p.id} | #{p.name} | #{response.code} | #{p.image_url}"
      broken_count += 1
    end
  rescue => e
    puts "[ERROR] #{p.id} | #{p.name} | #{e.message} | #{p.image_url}"
    broken_count += 1
  end
end

puts "\nValidation Complete."
puts "Total Broken Images: #{broken_count}"
