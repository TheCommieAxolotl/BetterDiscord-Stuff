/**
 * @name UnMask
 * @author TheCommieAxolotl#0001
 * @description Reveal the true identities of those who dare enter your chat.
 * @version 0.0.1
 * @authorId 538487970408300544
 * @invite 5BSWtSM3XU
 * @source https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/tree/main/UnMask
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/UnMask/UnMask.plugin.js
 * @donate https://github.com/sponsors/thecommieaxolotl
 */

module.exports = (() => {
    const config = {
        info: {
            name: "UnMask",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544",
                },
            ],
            github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/UnMask/UnMask.plugin.js",
            version: "0.0.1",
            description: "Reveal the true identities of those who dare enter your chat.",
        },
    };

    return !global.ZeresPluginLibrary
        ? class {
              constructor() {
                  this._config = config;
              }
              getName() {
                  return config.info.name;
              }
              getAuthor() {
                  return config.info.authors.map((a) => a.name).join(", ");
              }
              getDescription() {
                  return config.info.description;
              }
              getVersion() {
                  return config.info.version;
              }
              load() {
                  BdApi.showConfirmationModal("Library Missing", `The library plugin needed for **${config.info.name}** is missing. Please click Download Now to install it.`, {
                      confirmText: "Download Now",
                      cancelText: "Cancel",
                      onConfirm: () => {
                          require("request").get("https://zerebos.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                              if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                              await new Promise((r) => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                          });
                      },
                  });
              }
              start() {}
              stop() {}
          }
        : (([Plugin, Api]) => {
              const plugin = (Plugin, Api) => {
                  const { Patcher, Logger, WebpackModules, Filters } = Api;
                  const { React, injectCSS, clearCSS } = BdApi;

                  const Styles = `
.unmask-profile {
    position: absolute;
    left: 38px;
    margin-top: calc(4px - .125rem);
    width: 18px;
    height: 18px;
    top: 26px;
    border: 3px solid var(--background-primary);
    background: var(--background-primary);
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    -webkit-box-flex: 0;
    flex: 0 0 auto;
    pointer-events: none;
    z-index: 1;
}

[class*="repliedMessage"] + * .unmask-profile {
    top: 45px;
}
                  `;

                  return class UnMask extends Plugin {
                      async onStart() {
                          injectCSS("UnMask-Styles", Styles);

                          const MessageHeader = WebpackModules.getModule((m) => m.default.displayName == "MessageHeader");

                          Logger.log("UnMask", "Patching MessageHeader");
                          Patcher.after(MessageHeader, "default", (_, props, ret) => {
                              const OriginalProfile = props[0].message.author.getAvatarURL();
                              const HasGuildAvatar = !!props[0].author.guildMemberAvatar;
                              const Nickname = props[0].author.nick;
                              const HasNick = !Boolean(Nickname == props[0].message.author.username);

                              if (HasNick) {
                                  if (props[0].author.unmaskedName) return;
                                  props[0].author.unmaskedName = true;
                                  props[0].author.nick = `${Nickname} (${props[0].message.author.username})`;
                              }
                              if (HasGuildAvatar) {
                                  if (props[0].author.unmaskedProfile) return;
                                  props[0].author.unmaskedProfile = true;

                                  Patcher.after(ret.props.avatar.props, "children", (_, properties, returnValue) => {
                                      returnValue.props.children[0].props.className = `${returnValue.props.children[0].props.className} unmask-guildProfile`;
                                      returnValue.props.children.push(React.createElement("img", { src: OriginalProfile, className: "unmask-profile" }));
                                  });
                              }
                          });
                      }

                      async onStop() {
                          Patcher.unpatchAll();
                          clearCSS("UnMask-Styles");
                      }
                  };
              };

              return plugin(Plugin, Api);
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
