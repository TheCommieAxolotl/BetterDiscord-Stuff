/**
  * @name CallWarnings
  * @version 0.3.0
  * @author TheCommieAxolotl#6898
  * @authorId 538487970408300544
  * @description Makes it harder to accidentally call someone.
  * @invite g2KnUw7u7N
  * @source https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/CallWarnings/CallWarnings.plugin.js
  * @updateUrl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/CallWarnings/CallWarnings.plugin.js
  * @import https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/blob/main/CallWarnings/CallWarnings.plugin.js
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
           github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/CallWarnings/CallWarnings.plugin.js",
           version: "0.3.0",
           description: "Makes it harder to accidentally call someone."
       },

       defaultConfig: [
          {
              type: "switch",
              id: "hideAll",
              name: "Hide Call Direct Call Buttons",
              note: "Removes ALL Call Buttons (Requires restart with ctrl + r)",
              value: true,
          },
      ],

       changelog: [
           {
               title: 'Update',
               type: 'fixed',
               items: ['Fixed Settings.']

           }
       ],


   }

      const NoButtonCSS =
  `
  #user-context-call
  {
    display: none !important;
  }

  [aria-label='Start Video Call'] .icon-22AiRD,
  [aria-label='Start Voice Call'] .icon-22AiRD
  {
    display: none !important;
  }

    `;

       const PluginCSS =
  `
  #user-context-call:hover,
  #user-context-call.focused-3afm-j
  {
    background: red;
    color:white;
    border-radius:7px;
    transform:scale(1.02);
    margin-right:2px;
    font-size:15px;
    transition:150ms;
  }

[aria-label='Start Video Call'] .icon-22AiRD:hover,
[aria-label='Start Voice Call'] .icon-22AiRD:hover
{
    color: red!important;
}


/* Badges */
#app-mount [data-user-id="753142102736502885"] .badgeList-1R1WgZ::after,
#app-mount [data-user-id="753142102736502885"] .profileBadges-ohc0Vu::after,
#app-mount [data-user-id="753142102736502885"] .badges-XRnWAp::after {
  content: "";
  width: 22px;
  height: 22px;
  background: url(https://cdn.discordapp.com/attachments/886895257176924170/892684287403495434/Screen_Shot_2021-09-29_at_6.08.35_pm.png) center / 100% 100%;
}

#app-mount [data-user-id="538487970408300544"] .badgeList-1R1WgZ::after,
#app-mount [data-user-id="538487970408300544"] .profileBadges-ohc0Vu::before,
#app-mount [data-user-id="538487970408300544"] .badges-XRnWAp::after{
  content: "";
  position: relative;
  right: 0px;
  top: 0px;
  width: 22px;
  height: 22px;
  background: url(https://cdn.discordapp.com/attachments/886895099626274836/892615067936378890/Untitled_Artwork_3.png) center / 100% 100%;
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

      if (this.settings.hideAll) {
        PluginUtilities.addStyle(this.getName(), NoButtonCSS);
      }

   }

     onStop() {
        PluginUtilities.removeStyle(this.getName());
        Patcher.unpatchAll();
     }

     getSettingsPanel() {
         const panel = this.buildSettingsPanel();
         panel.addListener(() => {
             this.doCleanup();
             this.doSetup();
         });
         return panel.getElement();
     }

     updateSettings(id, value) {
         if (id !== "hideAll") return;
         if (value) return this.disableCallButtons();
         return this.disableCallButtons();
     }

   };

  };

  return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
