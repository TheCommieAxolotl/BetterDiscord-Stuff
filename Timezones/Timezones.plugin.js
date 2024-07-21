/**
 * @name Timezones
 * @author TheCommieAxolotl#0001
 * @description Allows you to display other Users' local times.
 * @version 1.2.0
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
            version: "1.2.0",
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
                name: "Show local timestamp next to message",
                value: true,
            },
            {
                type: "switch",
                id: "showOffset",
                name: "Show localized GMT format (e.g., GMT-8)",
                value: false,
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
                  const { Data, React, injectCSS, clearCSS, Webpack, ContextMenu, UI, Components } = BdApi;

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
    top: 10px;
    left: 10px;
    background: var(--profile-body-background-color, var(--background-primary));
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: var(--text-normal);
}
                  `;

                  const Markdown = Webpack.getModule((m) => m?.rules && m?.defaultProps?.parser);
                  const SearchableSelect = Webpack.getByKeys("Button", "SearchableSelect")?.SearchableSelect;
                  const ProfileBanner = Webpack.getModule(Webpack.Filters.byStrings("BITE_SIZE_PROFILE_POPOUT", "profileStatusEditEnabled"), { defaultExport: false });
                  const MessageHeader = Webpack.getModule(Webpack.Filters.byStrings("userOverride", "withMentionPrefix"), { defaultExport: false });
                  const Tooltip = Components.Tooltip;
                  const i18n = Webpack.getByKeys("getLocale");

                  return class Timezones extends Plugin {
                      async onStart() {
                          injectCSS("Timezones-Styles", Styles);

                          ContextMenu.patch("user-context", this.userContextPatch);

                          Patcher.after(ProfileBanner, "Z", (_, [props], ret) => {
                              if (!this.hasTimezone(props.user.id)) return;

                              ret.props.children.props.children.props.children[0].props.children[1].props.children.push(
                                  React.createElement(Tooltip, {
                                      text:
                                          this.getTime(props.user.id, Date.now(), { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" }) +
                                          ` (${DataStore[props.user.id]})`,
                                      children: (p) =>
                                          React.createElement("div", { ...p, className: "timezone-badge" }, this.getTime(props.user.id, Date.now(), { hour: "numeric", minute: "numeric" })),
                                  })
                              );
                          });

                          Patcher.after(MessageHeader, "Z", (_, [props], ret) => {
                              if (props.isRepliedMessage || !this.settings.showInMessage) return;

                              if (!this.hasTimezone(props.message.author.id)) return;

                              ret.props.children.push(
                                  React.createElement(Tooltip, {
                                      text:
                                          this.getTime(props.message.author.id, props.message.timestamp, {
                                              weekday: "long",
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric",
                                          }) + ` (${DataStore[props.message.author.id]})`,
                                      children: (p) =>
                                          React.createElement(
                                              "span",
                                              { ...p, className: "timezone" },
                                              this.getTime(props.message.author.id, props.message.timestamp, { hour: "numeric", minute: "numeric" })
                                          ),
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
                                      DataStore[props.user.id] &&
                                          ContextMenu.buildItem({
                                              type: "text",
                                              disabled: true,
                                              label: DataStore[props.user.id],
                                          }),
                                      ContextMenu.buildItem({
                                          label: DataStore[props.user.id] ? "Change Timezone" : "Set Timezone",
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
                                  ].filter((x) => x),
                              }),
                          ]);
                      };

                      hasTimezone(id) {
                          const value = DataStore[id];

                          return !Array.isArray(value) && !!value;
                      }

                      setTimezone(id, user) {
                          let outvalue = null;

                          // https://github.com/Syncxv/vc-timezones/blob/master/TimezoneModal.tsx
                          // I totally forgot about the Intl API until I saw their plugin in vencord
                          const options = Intl.supportedValuesOf("timeZone").map((timezone) => {
                              const offset = new Intl.DateTimeFormat(undefined, { timeZone: timezone, timeZoneName: "short" })
                                  .formatToParts(new Date())
                                  .find((part) => part.type === "timeZoneName").value;

                              return { label: `${timezone} (${offset})`, value: timezone };
                          });

                          UI.showConfirmationModal(
                              `Set Timezone for ${user.username}`,
                              [
                                  React.createElement(Markdown, null, "Please select a timezone."),
                                  React.createElement(() => {
                                      const [currentValue, setCurrentValue] = React.useState(DataStore[id] || null);

                                      return React.createElement(SearchableSelect, {
                                          options,
                                          value: options.find((o) => o.value === currentValue),
                                          placeholder: "Select a Timezone",
                                          maxVisibleItems: 5,
                                          closeOnSelect: true,
                                          onChange: (value) => {
                                              setCurrentValue(value);

                                              outvalue = value;
                                          },
                                      });
                                  }),
                              ],
                              {
                                  confirmText: "Set",
                                  onConfirm: () => {
                                      DataStore[id] = outvalue;

                                      BdApi.showToast(`Timezone set to ${outvalue} for ${user.username}`, {
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

                      getTime(id, time, props) {
                          const timezone = DataStore[id];

                          if (!timezone) return null;

                          const date = new Date(time);

                          const formatter = new Intl.DateTimeFormat(i18n?.getLocale?.() ?? "en-US", {
                              hourCycle: this.settings.twentyFourHours ? "h23" : "h12",
                              timeZone: timezone,
                              timeZoneName: this.settings.showOffset ? "shortOffset" : undefined,
                              ...props,
                          });

                          return formatter.format(date);
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
