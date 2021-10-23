/**
 * @name AlwaysShowOffline
 * @author TheCommieAxolotl#6898
 * @description Always show offline users in memberlist.
 * @version 0.0.4
 * @authorId 538487970408300544
 * @source https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/AlwaysShowOffline/AlwaysShowOffline.plugin.js
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/AlwaysShowOffline/AlwaysShowOffline.plugin.js
 * @import https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/blob/main/AlwaysShowOffline/AlwaysShowOffline.plugin.js
 */



module.exports = (() => {
    const config = {
        info: {
            name: "AlwaysShowOffline",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544"
                }
            ],
            github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/AlwaysShowOffline/AlwaysShowOffline.plugin.js",
            version: "0.0.4",
            description: "Always show offline users in memberlist. (Disabling requires restart)"
        },

        defaultConfig: [
            {
                type: "switch",
                id: "showToasts",
                name: "Show Toasts",
                note: "Remove Notifications from AlwaysShowOffline",
                value: false,
            },
            {
                type: "switch",
                id: "devMode",
                name: "Developer Mode",
                note: "No one else is going to use this. Right?",
                value: false,
            },

        ],

        changelog: [
            {
                title: 'Pre-Release',
                type: 'added',
                items: ['First version!'],
            },
        ],


    }
    
    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() { 

            const guildId = BdApi.findModuleByProps('getLastSelectedGuildId').getGuildId()
            const guildInfo = BdApi.findModuleByProps('getGuild').getGuild(guildId)
            console.log(guildInfo)
         }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { DiscordModules: { React, DiscordConstants, ReactDOM }, DiscordModules, WebpackModules, Patcher, PluginUtilities } = Api;

            return class AlwaysShowOffline extends Plugin {
                
                async onStart() {

                    const guildId = BdApi.findModuleByProps('getLastSelectedGuildId').getGuildId()
                    const guildInfo = BdApi.findModuleByProps('getGuild').getGuild(guildId)
                    console.log(guildInfo)

                    BdApi.findModuleByProps("dirtyDispatch").subscribe("LOAD_MESSAGES", () => {
                        return this.changeServer()
                    })

                }

                onStop() {
                    Patcher.unpatchAll();
                    BdApi.findModuleByProps("dirtyDispatch").unsubscribe("LOAD_MESSAGES", () => {})
                }

                changeServer() {

                    const guildId = BdApi.findModuleByProps('getLastSelectedGuildId').getGuildId()
                    const guildInfo = BdApi.findModuleByProps('getGuild').getGuild(guildId)

                    console.log(guildInfo)

                    const currentGuildId = guildInfo.id;

                    guildInfo.showOffline = true;

                    guildInfo.members = 10;

                    if (guildInfo.showOffline = true) {

                        // At a later date i will add select servers option 
                            BdApi.showToast("Showing offline Members for this Guild.", { timeout: 3000, type: 'success' });

                    }

                    else {
                        
                        BdApi.showToast("Guild disabled.", { timeout: 3000, type: 'faliure' });

                    }

                }

                enableDev() {}

                getSettingsPanel() {
                    const panel = this.buildSettingsPanel();
                    panel.addListener(() => {
                        this.doCleanup();
                        this.doSetup();
                    });
                    return panel.getElement();
                }

                updateSettings(id, value) {
                    if (id !== "devMode") return;
                    if (value) return this.enableDev();
                    return this.disableDev();
                }

            };

        };

        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/

