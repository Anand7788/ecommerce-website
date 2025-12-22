user = User.find_by(email: 'anandkumarprasad750@gmail.com')
if user
  puts "User Found: true"
  puts "Admin Status: #{user.admin}"
  if !user.admin && ARGV[0] == 'fix'
    user.update(admin: true)
    puts "User promoted to admin."
  end
else
  puts "User Found: false"
end
