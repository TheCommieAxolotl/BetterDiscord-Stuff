/**
 * @name HideMessages
 * @author TheCommieAxolotl#6898
 * @description Locally Hide Messages
 * @version 0.0.1
 * @authorId 538487970408300544
 * @source 
 * @updateurl 
 * @import 
 * @invite g2KnUw7u7N
 */



module.exports = (() => {
    const config = {
        info: {
            name: "HideMessages",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544"
                }
            ],
            github_raw: "",
            version: "0.0.1",
            description: "Locally Hide Messages"
        },

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
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { DiscordModules: { React, DiscordConstants, ReactDOM }, DiscordModules, WebpackModules, Patcher, PluginUtilities } = Api;

            return class HideMessages extends Plugin {

                async onStart() {

                    

                }

                onStop() {
                    Patcher.unpatchAll();
                }

            };

        };

        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
