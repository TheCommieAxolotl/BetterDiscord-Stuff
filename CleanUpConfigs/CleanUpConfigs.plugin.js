/**
 * @name CleanUpConfigs
 * @author TheCommieAxolotl#0001
 * @description Check and remove config files that don't have a matching Plugin. Thanks to Strencher's ShowSessions for the functions to be able to patch settings.
 * @version 0.1.3
 * @authorId 538487970408300544
 * @invite 5BSWtSM3XU
 * @source https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/tree/main/CleanUpConfigs
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/CleanUpConfigs/CleanUpConfigs.plugin.js
 * @donate https://github.com/sponsors/thecommieaxolotl
 */

module.exports = (() => {
    const config = {
        info: {
            name: "CleanUpConfigs",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544",
                },
            ],
            github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/CleanUpConfigs/CleanUpConfigs.plugin.js",
            version: "0.1.3",
            description: " Check and remove config files that don't have a matching Plugin. Thanks to Strencher for the functions to be able to patch settings.",
        },

        defaultConfig: [
            {
                type: "switch",
                id: "debug",
                name: "Log Items To Console",
                note: "Logs the Items to be deleted to the console.",
                value: false,
            },
        ],
        changelog: [
            {
                title: "Fixed",
                type: "changed",
                items: ["Will no longer delete ChannelTabs configs"],
            },
        ],
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
                  const { Patcher, Logger, WebpackModules, Filters } = Api;
                  const { React, injectCSS, clearCSS, showConfirmationModal, showToast } = BdApi;

                  const fs = require("fs");

                  const filters = {
                      configs: /(\.config.json)$/,
                      plugins: /(\.plugin.js)$/,
                  };

                  const Title = BdApi.findModuleByProps("h1", "defaultMarginh1");
                  const TooltipWrapper = BdApi.findModuleByPrototypes("renderTooltip");
                  const Buttons = BdApi.findModuleByProps("ButtonSizes").default;
                  const ButtonColors = BdApi.findModuleByProps("ButtonSizes").ButtonColors;
                  const ButtonSizes = BdApi.findModuleByProps("ButtonSizes").ButtonSizes;
                  const Text = BdApi.findModuleByDisplayName("LegacyText");
                  const FormItem = BdApi.findModuleByProps("FormItem");

                  const styles = `
                    .CleanUpConfigs-seperator {
                        margin-block: 40px;
                    }
                    .CleanUpConfigs-warning {
                        color: var(--text-danger);
                        font-weight: 600;
                        margin-bottom: 10px;
                        font-size: 18px;
                    }
                    .CleanUpConfigs-bd-logo {
                        width: 14px;
                    }
                    .CleanUpConfigs-header {
                        display: flex;
                        gap: 4px;
                        margin-bottom: 5px;
                    }
                `;

                  /* From ShowSessions */
                  const overrides = {
                      useMemo: (factory) => factory(),
                      useState: (initialState) => [initialState, () => {}],
                      useReducer: (initialValue) => [initialValue, () => {}],
                      useEffect: () => {},
                      useLayoutEffect: () => {},
                      useRef: () => ({
                          current: null,
                      }),
                      useCallback: (callback) => callback,
                  };
                  const keys = Object.keys(overrides);

                  return class CleanUpConfigs extends Plugin {
                      async onStart() {
                          this.patchSettings();
                          injectCSS("CleanUpConfigsStyles", styles);
                      }

                      getSettingsPanel() {
                          const panel = this.buildSettingsPanel();
                          return panel.getElement();
                      }

                      /* Also From ShowSessions */
                      getLazy(filter) {
                          const fromCache = WebpackModules.getModule(filter);
                          if (fromCache) return Promise.resolve(fromCache);
                          return new Promise((resolve) => {
                              const cancel = WebpackModules.addListener((m) => {
                                  const matches = [m, m?.default];
                                  for (let i = 0; i < matches.length; i++) {
                                      const match = filter(matches[i]);
                                      if (!match) continue;
                                      resolve(matches[i]);
                                      cancel();
                                      break;
                                  }
                              });
                          });
                      }

                      /* Also Also From ShowSessions */
                      wrapInHooks(functionalComponent) {
                          const ReactDispatcher = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
                          const originals = keys.map((e) => [e, ReactDispatcher[e]]);
                          Object.assign(ReactDispatcher, overrides);
                          let returnValue = null,
                              error = null;
                          try {
                              returnValue = functionalComponent();
                          } catch (err) {
                              error = err;
                          }
                          Object.assign(ReactDispatcher, Object.fromEntries(originals));
                          if (error) throw error;
                          return returnValue;
                      }

                      async patchSettings() {
                          const ConnectedUserAccountSettings = await this.getLazy(Filters.byDisplayName("ConnectedUserAccountSettings"));
                          const AccountSettings = this.wrapInHooks(() => ConnectedUserAccountSettings({})?.type);
                          await Patcher.after(AccountSettings.prototype, "render", (_this, _, res) => {
                              if (!Array.isArray(res?.props?.children)) return;

                              res.props.children.push([
                                  React.createElement(FormItem.FormDivider, {
                                      className: "CleanUpConfigs-seperator",
                                  }),
                                  React.createElement("div", {
                                      className: "CleanUpConfigs-header",
                                      children: [
                                          BdApi.React.createElement(TooltipWrapper, {
                                              position: TooltipWrapper.Positions.TOP,
                                              color: TooltipWrapper.Colors.PRIMARY,
                                              text: "This is a local BetterDiscord tool.",
                                              children: (tipProps) => {
                                                  return BdApi.React.createElement(
                                                      "div",
                                                      Object.assign(
                                                          {
                                                              children: [
                                                                  React.createElement("svg", {
                                                                      viewBox: "0 0 2000 2000",
                                                                      className: "CleanUpConfigs-bd-logo",
                                                                      children: [
                                                                          React.createElement("g", {
                                                                              children: [
                                                                                  React.createElement("path", {
                                                                                      d: "M1402.2,631.7c-9.7-353.4-286.2-496-642.6-496H68.4v714.1l442,398V490.7h257c274.5,0,274.5,344.9,0,344.9H597.6v329.5h169.8c274.5,0,274.5,344.8,0,344.8h-699v354.9h691.2c356.3,0,632.8-142.6,642.6-496c0-162.6-44.5-284.1-122.9-368.6C1357.7,915.8,1402.2,794.3,1402.2,631.7z",
                                                                                      fill: "#3E82E5",
                                                                                  }),
                                                                                  React.createElement("path", {
                                                                                      d: "M1262.5,135.2L1262.5,135.2l-76.8,0c26.6,13.3,51.7,28.1,75,44.3c70.7,49.1,126.1,111.5,164.6,185.3c39.9,76.6,61.5,165.6,64.3,264.6l0,1.2v1.2c0,141.1,0,596.1,0,737.1v1.2l0,1.2c-2.7,99-24.3,188-64.3,264.6c-38.5,73.8-93.8,136.2-164.6,185.3c-22.6,15.7-46.9,30.1-72.6,43.1h72.5c346.2,1.9,671-171.2,671-567.9V716.7C1933.5,312.2,1608.7,135.2,1262.5,135.2z",
                                                                                      fill: "#FFFFFF",
                                                                                  }),
                                                                              ],
                                                                          }),
                                                                      ],
                                                                  }),
                                                              ],
                                                          },
                                                          tipProps,
                                                      ),
                                                  );
                                              },
                                          }),
                                          React.createElement(
                                              FormItem.FormTitle,
                                              {
                                                  tag: "h5",
                                                  className: "CleanUpConfigs-form-title",
                                              },
                                              "Clean Up Config Files",
                                          ),
                                      ],
                                  }),
                                  React.createElement(
                                      FormItem.FormText,
                                      {
                                          className: [
                                              BdApi.findModuleByProps("description", "disableButton", "buttonContainer").description,
                                              BdApi.findModuleByProps("description", "labelSelected", "placeholder").description,
                                          ],
                                          tag: "div",
                                      },
                                      "Check for BetterDiscord Config files that don't have a matching Plugin.",
                                  ),
                                  React.createElement(
                                      Buttons,
                                      {
                                          id: "check-configs",
                                          color: ButtonColors.RED,
                                          size: ButtonSizes.SMALL,
                                          className: "CleanUpConfigs-button",
                                          onClick: async () => {
                                              let toDel = [];
                                              let plugins = {};
                                              fs.readdir(BdApi.Plugins.folder, (err, files) => {
                                                  if (err) return Logger.error(`Error reading Plugins Folder`);
                                                  try {
                                                      this.pfiles = files.filter((file) => filters.plugins.test(file));
                                                      this.cfiles = files.filter((file) => filters.configs.test(file));
                                                      this.pfiles.forEach((file) => {
                                                          let rp = file.replace(".plugin.js", "");

                                                          plugins = { ...plugins, [rp]: [rp] };
                                                      });
                                                      this.cfiles.forEach((p) => {
                                                          let n = p.replace(".config.json", "");

                                                          if (!plugins.hasOwnProperty(n) && !BdApi.Plugins.get(n) && !n.toLowerCase().includes("channeltabs")) {
                                                              if (this.settings.debug) Logger.log(`Marked ${n} config to delete.`);

                                                              toDel = [...toDel, n];
                                                          }
                                                      });
                                                      if (toDel.length !== 0) {
                                                          showConfirmationModal(
                                                              `${toDel.length} Unused Config Files Found!`,
                                                              [
                                                                  React.createElement(
                                                                      Text,
                                                                      {
                                                                          size: Text.Sizes.SIZE_16,
                                                                          className: "CleanUpConfigs-warning",
                                                                      },
                                                                      "Do you want to Delete them?",
                                                                  ),
                                                                  toDel.map((file) =>
                                                                      React.createElement(
                                                                          Text,
                                                                          {
                                                                              color: Text.Colors.HEADER_SECONDARY,
                                                                              size: Text.Sizes.SIZE_16,
                                                                          },
                                                                          file + ".config.json",
                                                                      ),
                                                                  ),
                                                              ],
                                                              {
                                                                  confirmButtonColor: ButtonColors.BRAND,
                                                                  confirmText: "Delete",
                                                                  danger: true,
                                                                  cancelText: "Cancel",
                                                                  onConfirm: () => {
                                                                      try {
                                                                          toDel.forEach((p) => {
                                                                              const path = BdApi.Plugins.folder + "/" + p + ".config.json";
                                                                              fs.unlink(path, () => {});
                                                                              showToast(`Successfully deleted ${p}.config.json`, { type: "success" });
                                                                          });
                                                                      } catch (e) {
                                                                          console.log(e);
                                                                      }
                                                                  },
                                                              },
                                                          );
                                                      } else {
                                                          showToast("0 Unused Config Files Found.");
                                                      }
                                                  } catch (e) {
                                                      Logger.error(`Error reading Plugins Folder' ${e}`);
                                                  }
                                              });
                                          },
                                      },
                                      "Check Configs",
                                  ),
                              ]);
                          });
                      }

                      async onStop() {
                          Patcher.unpatchAll();
                          clearCSS("CleanUpConfigsStyles");
                      }
                  };
              };

              return plugin(Plugin, Api);
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
