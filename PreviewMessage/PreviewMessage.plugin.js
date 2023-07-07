/**
 * @name PreviewMessage
 * @author TheCommieAxolotl
 * @description Allows you to preview a message before you send it.
 * @version 1.0.2
 * @authorId 538487970408300544
 * @invite 5BSWtSM3XU
 * @source https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/tree/main/PreviewMessage
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/PreviewMessage/PreviewMessage.plugin.js
 * @donate https://github.com/sponsors/thecommieaxolotl
 */

module.exports = (() => {
    const config = {
        info: {
            name: "PreviewMessage",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544",
                },
            ],
            github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/PreviewMessage/PreviewMessage.plugin.js",
            version: "1.0.2",
            description: "Allows you to preview a message before you send it.",
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
                          require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
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
                  const { Patcher, Utilities } = Api;
                  const { Data, React, injectCSS, clearCSS, Webpack } = BdApi;

                  const DataStore = new Proxy(
                      {},
                      {
                          get: (_, key) => Data.load(config.info.name, key),
                          set: (_, key, value) => {
                              Data.save(config.info.name, key, value);
                              return true;
                          },
                          deleteProperty: (_, key) => {
                              Data.delete(config.info.name, key);
                              return true;
                          },
                      }
                  );

                  const Styles = `
.preview-button {
    background-color: transparent;
    border: none;
    height: 8px;
    filter: grayscale(100%);
    cursor: pointer;
    color: var(--interactive-normal);
}

.preview-button:hover {
    color: var(--interactive-active);
}

[class*=innerDisabled] .preview-button {
    display: none;
}
                  `;

                  const Tooltip = BdApi.Components.Tooltip;

                  const SelectedChannelStore = Webpack.getModule((m) => m.getLastSelectedChannelId);
                  const DraftStore = Webpack.getModule((m) => m.getDraft);
                  const MessageActions = Webpack.getModule((m) => m.sendBotMessage);
                  const ChannelTextArea = Webpack.getModule((m) => m.type?.render?.toString?.().includes("CHANNEL_TEXT_AREA).AnalyticsLocationProvider"));

                  return class PreviewMessage extends Plugin {
                      onStart() {
                          injectCSS("PreviewMessage-Styles", Styles);

                          Patcher.after(ChannelTextArea.type, "render", (_, __, ret) => {
                              const chatBar = Utilities.findInReactTree(ret, (n) => Array.isArray(n?.children) && n.children.some((c) => c?.props?.className?.startsWith("attachButton")))?.children;
                              if (!chatBar) {
                                  console.error("PreviewMessage: Couldn't find ChatBar component in React tree");
                                  return;
                              }

                              const buttons = Utilities.findInReactTree(chatBar, (n) => n?.props?.showCharacterCount);
                              if (buttons?.props.disabled) return;

                              chatBar.splice(-1, 0, this.renderButton());
                          });
                      }

                      sendPreview() {
                          const channelID = SelectedChannelStore.getChannelId();

                          const draft = DraftStore.getDraft(channelID, 0);

                          if (draft) {
                              MessageActions.sendBotMessage(channelID, draft);
                          }
                      }

                      renderButton() {
                          return React.createElement(Tooltip, {
                              text: "Preview Message",
                              children: (p) =>
                                  React.createElement(
                                      "div",
                                      {
                                          style: {
                                              marginTop: "10px",
                                          },
                                      },
                                      React.createElement(
                                          "button",
                                          {
                                              ...p,
                                              className: "preview-button",
                                              onClick: () => {
                                                  this.sendPreview();
                                              },
                                          },
                                          React.createElement(
                                              "svg",
                                              {
                                                  xmlns: "http://www.w3.org/2000/svg",
                                                  viewBox: "0 0 36 36",
                                                  width: "24",
                                                  height: "24",
                                              },
                                              React.createElement("ellipse", {
                                                  fill: "currentColor",
                                                  cx: "8.828",
                                                  cy: "18",
                                                  rx: "7.953",
                                                  ry: "13.281",
                                              }),
                                              React.createElement("path", {
                                                  fill: "currentColor",
                                                  d: "M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z",
                                              }),
                                              React.createElement("circle", {
                                                  fill: "var(--bg-overlay-3,var(--channeltextarea-background))",
                                                  cx: "6.594",
                                                  cy: "18",
                                                  r: "4.96",
                                              }),
                                              React.createElement("circle", {
                                                  fill: "var(--bg-overlay-3,var(--channeltextarea-background))",
                                                  cx: "6.594",
                                                  cy: "18",
                                                  r: "3.565",
                                              }),
                                              React.createElement("circle", {
                                                  fill: "currentColor",
                                                  cx: "7.911",
                                                  cy: "15.443",
                                                  r: "1.426",
                                              }),
                                              React.createElement("ellipse", {
                                                  fill: "currentColor",
                                                  cx: "27.234",
                                                  cy: "18",
                                                  rx: "7.953",
                                                  ry: "13.281",
                                              }),
                                              React.createElement("path", {
                                                  fill: "currentColor",
                                                  d: "M27.234 32.031c-4.88 0-8.703-6.163-8.703-14.031s3.823-14.031 8.703-14.031S35.938 10.132 35.938 18s-3.824 14.031-8.704 14.031zm0-26.562c-3.972 0-7.203 5.622-7.203 12.531 0 6.91 3.231 12.531 7.203 12.531S34.438 24.91 34.438 18 31.206 5.469 27.234 5.469z",
                                              }),
                                              React.createElement("circle", {
                                                  fill: "var(--bg-overlay-3,var(--channeltextarea-background))",
                                                  cx: "25",
                                                  cy: "18",
                                                  r: "4.96",
                                              }),
                                              React.createElement("circle", {
                                                  fill: "var(--bg-overlay-3,var(--channeltextarea-background))",
                                                  cx: "25",
                                                  cy: "18",
                                                  r: "3.565",
                                              }),
                                              React.createElement("circle", {
                                                  fill: "currentColor",
                                                  cx: "26.317",
                                                  cy: "15.443",
                                                  r: "1.426",
                                              })
                                          )
                                      )
                                  ),
                          });
                      }

                      onStop() {
                          Patcher.unpatchAll();
                          clearCSS("PreviewMessage-Styles");
                      }
                  };
              };

              return plugin(Plugin, Api);
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
