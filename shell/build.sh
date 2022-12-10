if [ -z "$1" ]
  then
    # no build steps mentioned
    osascript -e 'tell app "Terminal" to do script "
            cd ~/blt/app/main/core &&
            corecli core:build
        "
    '
else
    # one of {clean, pre, compile, post, plsql} step supplied
    osascript -e 'tell app "Terminal" to do script "
            cd ~/blt/app/main/core &&
            corecli core:build '"$1"'
        "
    '
fi