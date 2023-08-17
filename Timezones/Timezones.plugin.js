/**
 * @name Timezones
 * @author TheCommieAxolotl#0001
 * @description Allows you to display other Users' local times.
 * @version 1.0.3
 * @authorId 538487970408300544
 * @invite 5BSWtSM3XU
 * @source https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/tree/main/Timezones
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/Timezones/Timezones.plugin.js
 * @donate https://github.com/sponsors/thecommieaxolotl
 */

module.exports = (() => {
    const config = {
        info: {
            name: "Timezones",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544",
                },
            ],
            github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/Timezones/Timezones.plugin.js",
            version: "1.0.3",
            description: "Allows you to display other Users' local times.",
        },
        defaultConfig: [
            {
                type: "switch",
                id: "twentyFourHours",
                name: "24 Hour Time",
                value: false,
            },
            {
                type: "switch",
                id: "showInMessage",
                name: "Show timezone next to message timestamp",
                value: true,
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
                  const { Patcher } = Api;
                  const { Data, React, injectCSS, clearCSS, Webpack, ContextMenu, UI } = BdApi;

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
.timezone {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.375rem;
    color: var(--text-muted);
    vertical-align: baseline;
    display: inline-block;
    height: 1.25rem;
    cursor: default;
    font-weight: 500;
}

[class*="compact"] .timezone {
    display: inline;
}

.timezone-margin-top {
    margin-top: 0.5rem;
}

.timezone-banner-container {
    position: relative;
}

.timezone-badge {
    position: absolute;
    bottom: 10px;
    right: 16px;
    background: var(--profile-body-background-color, var(--background-primary));
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: var(--text-normal);
}
                  `;

                  const TextInput = Webpack.getModule((m) => m?.Sizes?.MINI && m?.defaultProps?.type === "text", {
                      searchExports: true,
                  });
                  const Markdown = Webpack.getModule((m) => m.Z?.rules && m.Z?.defaultProps?.parser).Z;

                  return class Timezones extends Plugin {
                      async onStart() {
                          injectCSS("Timezones-Styles", Styles);

                          const ProfileBanner = Webpack.getModule((m) => m.Z?.toString().includes("e.hasBanner") && m.Z?.toString().includes("e.hasThemeColors"));
                          const MessageHeader = Webpack.getModule((m) => m.Z?.toString().includes("userOverride") && m.Z?.toString().includes("withMentionPrefix"));
                          const Tooltip = BdApi.Components.Tooltip;

                          ContextMenu.patch("user-context", this.userContextPatch);

                          Patcher.after(ProfileBanner, "Z", (_, [props], ret) => {
                              const originalRet = { ...ret };

                              if (!this.hasTimezone(props.user.id)) return;

                              ret.type = "div";
                              ret.props = {
                                  className: "timezone-banner-container",
                                  children: [
                                      originalRet,
                                      React.createElement(Tooltip, {
                                          text: this.getFullTime(props.user.id),
                                          children: (p) => React.createElement("div", { ...p, className: "timezone-badge" }, this.getLocalTime(props.user.id)),
                                      }),
                                  ],
                              };
                          });

                          Patcher.after(MessageHeader, "Z", (_, [props], ret) => {
                              if (props.isRepliedMessage || !this.settings.showInMessage) return;

                              this.hasTimezone(props.message.author.id) &&
                                  ret.props.children.push(
                                      React.createElement(Tooltip, {
                                          text: this.getFullTime(props.message.author.id, props.message.timestamp._d),
                                          children: (p) => React.createElement("span", { ...p, className: "timezone" }, this.getLocalTime(props.message.author.id, props.message.timestamp._d)),
                                      })
                                  );
                          });
                      }

                      userContextPatch = (ret, props) => {
                          const isDM = !Array.isArray(ret.props.children[0].props.children);

                          (isDM ? ret.props.children : ret.props.children[0].props.children).push([
                              ContextMenu.buildItem({ type: "separator" }),
                              ContextMenu.buildItem({
                                  type: "submenu",
                                  label: "Timezones",
                                  children: [
                                      ContextMenu.buildItem({
                                          label: "Set Timezone",
                                          action: () => {
                                              return this.setTimezone(props.user.id, props.user);
                                          },
                                      }),
                                      ContextMenu.buildItem({
                                          label: "Remove Timezone",
                                          danger: true,
                                          disabled: !this.hasTimezone(props.user.id),
                                          action: () => {
                                              return this.removeTimezone(props.user.id, props.user);
                                          },
                                      }),
                                  ],
                              }),
                          ]);
                      };

                      hasTimezone(id) {
                          return !!DataStore[id];
                      }

                      setTimezone(id, user) {
                          let hours = 0;
                          let minutes = 0;

                          UI.showConfirmationModal(
                              `Set Timezone for ${user.username}`,
                              [
                                  React.createElement(Markdown, null, "Please enter a UTC hour offset."),
                                  React.createElement(TextInput, {
                                      type: "number",
                                      maxLength: "2",
                                      placeholder: DataStore[id]?.[0] || "0",
                                      onChange: (v) => {
                                          hours = v;
                                      },
                                  }),
                                  React.createElement(Markdown, { className: "timezone-margin-top" }, "Please enter a UTC minute offset."),
                                  React.createElement(TextInput, {
                                      type: "number",
                                      maxLength: "2",
                                      placeholder: DataStore[id]?.[1] || "0",
                                      onChange: (v) => {
                                          minutes = v;
                                      },
                                  }),
                              ],
                              {
                                  confirmText: "Set",
                                  onConfirm: () => {
                                      DataStore[id] = [hours, minutes];

                                      BdApi.showToast(`Timezone set to UTC${hours > 0 ? `+${hours}` : hours}${minutes ? `:${minutes}` : ""} for ${user.username}`, {
                                          type: "success",
                                      });
                                  },
                              }
                          );
                      }

                      removeTimezone(id, user) {
                          delete DataStore[id];

                          BdApi.showToast(`Timezone removed for ${user.username}`, {
                              type: "success",
                          });
                      }

                      getLocalTime(id, time) {
                          const timezone = DataStore[id];

                          if (!timezone) return null;

                          let hours;
                          let minutes;

                          if (time) {
                              hours = time.getUTCHours() + Number(timezone[0]);
                              minutes = time.getUTCMinutes() + Number(timezone[1]);
                          } else {
                              hours = new Date().getUTCHours() + Number(timezone[0]);
                              minutes = new Date().getUTCMinutes() + Number(timezone[1]);
                          }

                          if (hours >= 24) {
                              hours -= 24;
                          } else if (hours < 0) {
                              hours += 24;
                          }

                          if (minutes >= 60) {
                              minutes -= 60;
                              hours += 1;
                          } else if (minutes < 0) {
                              minutes += 60;
                              hours -= 1;
                          }

                          if (this.settings.twentyFourHours) {
                              return `${hours.toString().length === 1 ? `0${hours}` : hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`;
                          }

                          const hour = hours > 12 ? hours - 12 : hours == 0 ? 12 : hours;
                          const ampm = hours >= 12 ? "PM" : "AM";

                          return `${hour}:${minutes.toString().length === 1 ? `0${minutes}` : minutes} ${ampm}`;
                      }

                      getFullTime(id, time) {
                          const timezone = DataStore[id];

                          if (!timezone) return null;

                          let date;

                          if (time) {
                              date = new Date(time);
                          } else {
                              date = new Date();
                          }

                          date.setTime(date.getTime() - date.getTimezoneOffset() * -60000 + timezone[0] * 3600000 + timezone[1] * 60000);

                          let ret = date.toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hourCycle: this.settings.twentyFourHours ? "h23" : "h12",
                          });

                          ret = ret.replace(/,(?=[^,]*$)/, "");

                          return ret;
                      }

                      onStop() {
                          Patcher.unpatchAll();
                          ContextMenu.unpatch("user-context", this.userContextPatch);
                          clearCSS("Timezones-Styles");
                      }

                      getSettingsPanel = () => {
                          return this.buildSettingsPanel().getElement();
                      };
                  };
              };

              return plugin(Plugin, Api);
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
