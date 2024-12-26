fx_version "adamant"

-- Eyes Notification / Support
-- discord.gg/EkwWvFS

game "gta5"

client_script { 
"main/client.lua"
}

server_script {
'@mysql-async/lib/MySQL.lua',
"main/server.lua"
} 

ui_page "index.html"

files {
    'index.html',
    'vue.js',
    'assets/**/*.*',
    'assets/font/*.otf',  
}

lua54 'yes'
-- dependency '/assetpacks'