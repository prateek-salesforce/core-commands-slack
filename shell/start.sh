osascript -e 'tell app "Terminal" to do script "
        cd ~/blt/app/main/core &&
        corecli core:start -b ;
        DATE_ISO=$(date +\"%H:%M:%S\") &&
        curl -X POST -H \"Authorization: Bearer xoxb-4489309567333-4477873786311-eU4FdUW8zMyya34IOgoCvrNu\" \"https://slack.com/api/chat.postMessage?channel=D04EJRRPYS0&text=----%20Completed%20at%20$DATE_ISO%20----&pretty=1\"
    "
'