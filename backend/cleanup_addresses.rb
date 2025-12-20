puts "Starting Cleanup..."
puts "Initial Address Count: #{Address.count}"
puts "Initial User Count: #{User.count}"

# Clean Addresses
invalid_addresses = Address.all.select { |a| a.mobile.to_s.length != 10 }
puts "Found #{invalid_addresses.count} invalid addresses. Deleting..."
invalid_addresses.each(&:destroy)

# Clean Users mobile
invalid_users = User.where("LENGTH(mobile) != 10").where.not(mobile: nil).where.not(mobile: "")
puts "Found #{invalid_users.count} users with invalid mobile. Clearing..."
invalid_users.each { |u| u.update(mobile: nil) }

puts "Final Address Count: #{Address.count}"
puts "Cleanup Complete."
