
# AlwaysShowOffline (**NOT FUNCTIONAL**) WILL ALWAYS CRASH YOUR DISCORD IF NOT SET UP CORRECTLY

Another utility plugin for BetterDiscord

Code that **needs** to be pasted into console on restart:
```js
var guildId = BdApi.findModuleByProps('getLastSelectedGuildId').getGuildId()
var guildInfo = BdApi.findModuleByProps('getGuild').getGuild(guildId)
```

# Features

- Always shows offline users in memberlist (doesn't work yet)

# Screenshots
