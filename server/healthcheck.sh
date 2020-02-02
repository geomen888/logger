function curl {
    local url=http://172.19.0.5:9005/api/transactions
    
    echo ">>> TESTING $url..."
    /usr/bin/curl --output /dev/null --silent $url \
        && echo ">>> OK!!!"
}

curl
echo ">>> WAIT 10s..." && sleep 10
curl