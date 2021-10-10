/**
  * @name CallWarnings
  * @version 0.0.1
  * @author TheCommieAxolotl#6898
  * @authorId 538487970408300544
  * @description Adds warnings to call button.
  * @source
  * @updateUrl
 */


module.exports = (() => {
  const config = {
       info: {
           name: "CallWarnings",
           authors: [
               {
                   name: "TheCommieAxolotl",
                   discord_id: "538487970408300544"
               }
           ],
           github_raw: "",
           version: "0.0.4",
           description: "Adds warnings to call button."
       },
       changelog: [
           {
               title: 'Update',
               type: 'fixed',
               items: ['Added the red tint to dm call buttons.']
           }
       ],
   }

       const PluginCSS =
  `
  #user-context-call:hover,
  #user-context-call.focused-3afm-j
  {
    background: #8c2525;
    color:white;
    border-radius:7px;
    transform:scale(1.02);
    margin-right:2px;
    font-size:15px;
    transition:150ms;
  }

  .icon-22AiRD
  {
      fill: #8c2525;
  }


    `;

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
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
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
      const {DiscordModules: {React, DiscordConstants, ReactDOM}, DiscordModules, WebpackModules, Patcher, PluginUtilities} = Api;

            return class CallWarnings extends Plugin {

     async onStart() {
         PluginUtilities.addStyle(this.getName(), PluginCSS);
     }

     onStop() {
       PluginUtilities.removeStyle(this.getName());
       Patcher.unpatchAll();
     }

   };

  };

  return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
