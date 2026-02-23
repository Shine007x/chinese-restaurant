#!/bin/bash

############################################
# BIND9 + APACHE2 MULTI-SITE REVERSE PROXY
# Ubuntu 24.04 LTS
# cafe.shine.com -> localhost:3000
# restaurant.kyaw.com -> localhost:3001
############################################

############################
# 1️⃣ INSTALL BIND9
############################
sudo apt update
sudo apt install bind9 bind9-utils bind9-doc -y
sudo systemctl enable bind9
sudo systemctl start bind9

############################
# 2️⃣ CONFIGURE BIND OPTIONS
############################
sudo tee /etc/bind/named.conf.options > /dev/null <<EOF
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-query { any; };
    listen-on { any; };
    listen-on-v6 { any; };
    dnssec-validation auto;
};
EOF

############################
# 3️⃣ CREATE ZONE CONFIG
############################
sudo tee -a /etc/bind/named.conf.local > /dev/null <<EOF
zone "shine.com" {
    type master;
    file "/etc/bind/db.shine.com";
};
zone "kyaw.com" {
    type master;
    file "/etc/bind/db.kyaw.com";
};
EOF

############################
# 4️⃣ CREATE DNS RECORD FILES
############################
sudo tee /etc/bind/db.shine.com > /dev/null <<EOF
\$TTL 604800
@   IN  SOA cafe.shine.com. root.shine.com. (
        2 604800 86400 2419200 604800 )

@       IN  NS      cafe.shine.com.
@       IN  A       127.0.0.1
cafe    IN  A       127.0.0.1
EOF

sudo tee /etc/bind/db.kyaw.com > /dev/null <<EOF
\$TTL 604800
@   IN  SOA restaurant.kyaw.com. root.kyaw.com. (
        2 604800 86400 2419200 604800 )

@           IN  NS      restaurant.kyaw.com.
@           IN  A       127.0.0.1
restaurant  IN  A       127.0.0.1
EOF

############################
# 5️⃣ RESTART DNS
############################
sudo systemctl restart bind9

############################
# 6️⃣ USE LOCAL DNS
############################
sudo sed -i 's/^#DNS=.*/DNS=127.0.0.1/' /etc/systemd/resolved.conf
sudo systemctl restart systemd-resolved

############################
# 7️⃣ INSTALL APACHE2
############################
sudo apt install apache2 -y
sudo a2enmod proxy proxy_http headers rewrite
sudo systemctl restart apache2

############################
# 8️⃣ CREATE APACHE VHOSTS
############################

# cafe.shine.com -> 3000
sudo tee /etc/apache2/sites-available/cafe.shine.com.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName cafe.shine.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
EOF

# restaurant.kyaw.com -> 3001
sudo tee /etc/apache2/sites-available/restaurant.kyaw.com.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName restaurant.kyaw.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/
</VirtualHost>
EOF

############################
# 9️⃣ ENABLE SITES
############################
sudo a2ensite cafe.shine.com.conf
sudo a2ensite restaurant.kyaw.com.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2

############################
# 🔟 BUILD & RUN APPS
############################

# CAFE APP
cd /home/kyaw-zin-hein/ai-cafe-project/ai-cafe
npm install
npm run build
PORT=3000 HOST=0.0.0.0 npm start &

# RESTAURANT APP
cd /home/kyaw-zin-hein/chinese-restaurant
npm install
npm run build
PORT=3001 HOST=0.0.0.0 npm start &

############################
# ✅ DONE
############################
echo "Setup Complete!"
echo "Open:"
echo "http://cafe.shine.com"
echo "http://restaurant.kyaw.com"
