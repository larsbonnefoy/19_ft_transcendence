token= curl "localhost:3000/api42/admin?login42=somelogin" | awk -F\" '{print $4}';
echo $test