/**
 * @name BetterSyntax
 * @author TheCommieAxolotl#0001
 * @description Lets you edit sytnax highligting with an easy interface and adds some useful buttons.
 * @version 1.5.0
 * @authorId 538487970408300544
 * @invite 5BSWtSM3XU
 * @source https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/tree/main/BetterSyntax
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/BetterSyntax/BetterSyntax.plugin.js
 * @import https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/blob/main/BetterSyntax/BetterSyntax.plugin.js
 */

module.exports = (() => {
    const config = {
        info: {
            name: "BetterSyntax",
            authors: [
                {
                    name: "TheCommieAxolotl",
                    discord_id: "538487970408300544",
                },
            ],
            github_raw: "https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/BetterSyntax/BetterSyntax.plugin.js",
            version: "1.5.0",
            description: "Lets you edit sytnax highligting with an easy interface and adds some useful buttons.",
        },

        defaultConfig: [
            {
                type: "category",
                id: "categoryPresets",
                name: "Presets",
                collapsible: true,
                shown: true,
                settings: [
                    {
                        type: "switch",
                        id: "enablePresets",
                        name: "Enable Preset Module",
                        note: "Without this, nothing in this category will apply.",
                        value: true,
                    },
                    {
                        name: "",
                        id: "theme",
                        type: "radio",
                        options: [
                            { name: "Default", desc: "Discord's default colors", value: "default" },
                            { name: "Nord Theme", value: "nord" },
                            { name: "Gruvbox Theme", value: "gruvbox" },
                            { name: "OneDark Theme", value: "onedark" },
                            { name: "Tokyo Night Theme", value: "tokyonight" },
                            { name: "Ultra Theme", value: "ultra" },
                        ],
                        value: "default",
                    },
                ],
            },
            {
                type: "category",
                id: "categoryEditor",
                name: "Editor",
                collapsible: true,
                shown: true,
                settings: [
                    {
                        type: "switch",
                        id: "enableEditor",
                        name: "Enable Editor Module",
                        note: "Without this, nothing in this category will apply.",
                        value: false,
                    },
                    {
                        type: "textbox",
                        id: "background",
                        name: "Code Background Color",
                        note: "Default: var(--background-secondary)",
                        value: "var(--background-secondary)",
                    },
                    {
                        type: "textbox",
                        id: "defaultColor",
                        name: "Default Color",
                        note: "Default: #b9bbbe",
                        value: "#b9bbbe",
                    },
                    {
                        type: "textbox",
                        id: "stringColor",
                        name: "String Color",
                        note: "Default: #2aa198",
                        value: "#2aa198",
                    },
                    {
                        type: "textbox",
                        id: "commentColor",
                        name: "Comment Color",
                        note: "Default: #4f545c",
                        value: "#4f545c",
                    },
                    {
                        type: "textbox",
                        id: "color1",
                        name: "Keyword Color",
                        note: "Default: #859900",
                        value: "#859900",
                    },
                    {
                        type: "textbox",
                        id: "color2",
                        name: "Fucntion Title Color",
                        note: "Default: #268bd2",
                        value: "#268bd2",
                    },
                    {
                        type: "textbox",
                        id: "color3",
                        name: "BuiltIn Color",
                        note: "Default: #F7768E",
                        value: "#F7768E",
                    },
                    {
                        type: "textbox",
                        id: "color4",
                        name: "CSS BuiltIn Color",
                        note: "Default: #F7768E",
                        value: "#F7768E",
                    },
                    {
                        type: "textbox",
                        id: "color5",
                        name: "Selector Color",
                        note: "Default: #268bd2",
                        value: "#268bd2",
                    },
                    {
                        type: "textbox",
                        id: "color6",
                        name: "Number Color",
                        note: "Default: #2aa198",
                        value: "#2aa198",
                    },
                    {
                        type: "textbox",
                        id: "color7",
                        name: "Attribute Color",
                        note: "Default: #b58900",
                        value: "#b58900",
                    },
                    {
                        type: "textbox",
                        id: "color8",
                        name: "Meta Color",
                        note: "Default: #cb4b16",
                        value: "#cb4b16",
                    },
                    {
                        type: "textbox",
                        id: "color9",
                        name: "Literal Color",
                        note: "Default: #cb4b16",
                        value: "#cb4b16",
                    },
                    {
                        type: "textbox",
                        id: "color10",
                        name: "Pseudo Selector Color",
                        note: "Default: #cb4b16",
                        value: "#cb4b16",
                    },
                    {
                        type: "textbox",
                        id: "other",
                        name: "Other Color",
                        note: "Default: #cb4b16",
                        value: "#cb4b16",
                    },
                ],
            },
        ],

        changelog: [
            {
                title: "Added",
                type: "added",
                items: ["Context Menus!!!!", "Ease of access to settings"],
            },
            {
                title: "Changed",
                type: "improved",
                items: ["Switched to RadioGroups"],
            },
        ],
    };

    const BetterSyntaxCSS = `@import url("https://fonts.googleapis.com/css2?family=Source Code Pro:wght@550&display=swap");.bettersyntax-tip{margin-bottom:10px;}code{font-family:"Source Code Pro"}.hljs{box-shadow: 2px 3px 10px 0px #00000057;border-radius:4px;margin-bottom:10px !important;border: none !important;} .hljs.collapsed {min-height: 28px; max-height: 28px; font-size: 0;} .hljs.collapsed .bettersyntax-buttons {padding-left: 5px;position: absolute; top: 10px;} .hljs.collapsed::before {content: "Collapsed codeblock";width: 76%;height: 28px;text-align: center;font-size: 10pt;position: absolute;padding-top: 5.5px;font-family: var(--font-primary);font-weight: 500;}`;
    const nordTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:#81A1C1 !important}.hljs-function .hljs-title{color:#8FBCBB !important}code.hljs{background-color:#2E343F}.hljs-selector-class{color:#8FBCBB}.hljs-number{color:#B48EAD}.hljs-attribute{color:#D8DEE9}.hljs-built_in{color:#88C0D0}.hljs{color:#81A1C1}.hljs-meta{color:#81A1C1}.hljs-string{color:#A3BE8C}.hljs-literal{color:#81A1C1}.hljs-selector-pseudo{color:#8FBCBB}.hljs-comment{color:#616E88}.hljs-bullet,.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol{color:#8FBCBB}`;
    const gruvboxTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:#FB4934 !important}.hljs-title{color:#FABD2F !important}.hljs-function .hljs-title{color:#FABD2F !important}code.hljs{background-color:#282828}.hljs-selector-class{color:#B8BB26}.hljs-number{color:#D3869B}.hljs-attribute{color:#FE8019}.hljs-built_in{color:#FB4934}.hljs{color:#EBDBB2}.hljs-meta{color:#FB4934}.hljs-string{color:#B8BB26}.hljs-literal{color:#FB4934}.hljs-selector-pseudo{color:#FABD2F}.hljs-comment{color:#928374}.hljs-doctag{color:#83A598}.hljs-bullet,.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol{color:#FB4934}`;
    const tokyonightTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:#BB9AF7 !important}.hljs-function .hljs-title{color:#7AA2F7 !important}code.hljs{background-color:#1A1B26}.hljs-selector-class{color:#9ECE6A}.hljs-number{color:#FF9E64}.hljs-attribute{color:#7AA2F7}.hljs-built_in{color:#F7768E}.css .hljs-built_in{color:#0DB9D7}.hljs{color:#C0CAF5}.hljs-meta{color:#81A1C1}.hljs-string{color:#9ECE6A}.hljs-literal{color:#81A1C1}.hljs-selector-pseudo{color:#BB9AF7}.hljs-comment{color:#444B6A}.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol,.hljs-bullet{color:#BB9AF7}`;
    const onedarkTheme = `.hljs{color:#abb2bf;background:#282c34 !important;}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}`;
    const ultraTheme = `.hljs{color:#dcddde;background:#17161b !important;}.hljs-comment,.hljs-quote{color:#b9bbbe;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#6e6af6}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#eb8181}.hljs-literal{color:#ffce97}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#97ffa5}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#fdff97}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#97aaff}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}`;

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
              start() {}
              stop() {}
          }
        : (([Plugin, Api]) => {
              const plugin = (Plugin, Api) => {
                  const { Tooltip, Logger, ContextMenu, Patcher, DCM } = Api;

                  const SelectedChannelStore = BdApi.findModuleByProps("getLastSelectedChannelId");

                  return class BetterSyntax extends Plugin {
                      async onStart() {
                          this.injectCSS();
                          this.addButtons();
                          this.lastChannelId = SelectedChannelStore.getChannelId();
                          this.onSwitch();
                          this.patchContext();

                          const Events = BdApi.findModuleByProps("dirtyDispatch");
                          Events.subscribe("LOAD_MESSAGES_SUCCESS", () => {
                              this.timeoutButtons();
                          });
                          Events.subscribe("MESSAGE_CREATE", () => {
                              this.timeoutButtons();
                          });
                      }

                      timeoutButtons() {
                          setTimeout(() => {
                              this.addButtons();
                          }, 200);
                      }

                      onStop() {
                          BdApi.clearCSS("nord");
                          BdApi.clearCSS("gruvbox");
                          BdApi.clearCSS("tokyonight");
                          BdApi.clearCSS("onedark");
                          BdApi.clearCSS("ultra");
                          BdApi.clearCSS("editor");
                          BdApi.clearCSS("BetterSyntaxCSS");

                          const Events = BdApi.findModuleByProps("dirtyDispatch");
                          Events.unsubscribe("LOAD_MESSAGES_SUCCESS", () => {
                              this.timeoutButtons();
                          });
                          Events.unsubscribe("MESSAGE_CREATE", () => {
                              this.timeoutButtons();
                          });
                      }

                      async patchContext() {
                          const MessageContextMenu = await ContextMenu.getDiscordMenu("MessageContextMenu");
                          await Patcher.after(MessageContextMenu, "default", (_, [props], component) => {
                              component.props.children.push(
                                  DCM.buildMenuItem({
                                      label: "BetterSyntax",
                                      type: "submenu",
                                      id: "bettersyntax-context",
                                      children: [
                                          DCM.buildMenuItem({
                                              label: "Change Theme",
                                              type: "text",
                                              action: () => {
                                                  this.showSettingsModal();
                                              },
                                          }),
                                      ],
                                  }),
                              );
                          });
                      }

                      getSettingsPanel() {
                          const panel = this.buildSettingsPanel();
                          setTimeout(() => {
                              const settingsPanel = document.querySelector(".button-collapse").parentNode.parentNode.parentNode;
                              const tip = document.createElement("div");
                              const newContent = document.createTextNode("TIP - if you don't like any of the preset themes, you can make your own in the Editor!");
                              const headerClasses = document.querySelector(".plugin-input-group h2").classList;

                              tip.appendChild(newContent);
                              tip.classList.add("bettersyntax-tip", ...headerClasses);

                              settingsPanel.parentNode.insertBefore(tip, settingsPanel);
                          }, 20);

                          panel.addListener(() => {
                              Logger.log("Called");
                              this.injectCSS();
                          });

                          return panel.getElement();
                      }

                      injectCSS() {
                          const editorTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:${this.settings.categoryEditor.color1}!important}.hljs-function .hljs-title{color:${this.settings.categoryEditor.color2}!important}code.hljs{background-color:${this.settings.categoryEditor.background}}.hljs-selector-class{color:${this.settings.categoryEditor.color5}}.hljs-number{color:${this.settings.categoryEditor.color6}}.hljs-attribute{color:${this.settings.categoryEditor.color7}}.hljs-built_in{color:${this.settings.categoryEditor.color3}}.css .hljs-built_in{color:${this.settings.categoryEditor.color4}}.hljs{color:${this.settings.categoryEditor.defaultColor}}.hljs-meta{color:${this.settings.categoryEditor.color8}}.hljs-string{color:${this.settings.categoryEditor.stringColor}}.hljs-literal{color:${this.settings.categoryEditor.color9}}.hljs-selector-pseudo{color:${this.settings.categoryEditor.color10}}.hljs-comment{color:${this.settings.categoryEditor.commentColor}}.hljs-bullet,.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol{color:${this.settings.categoryEditor.other}}`;

                          BdApi.injectCSS("BetterSyntaxCSS", BetterSyntaxCSS);

                          if (this.settings.categoryPresets.enablePresets) {
                              if (this.settings.categoryPresets.theme == "nord") {
                                  BdApi.injectCSS("nord", nordTheme);
                              }
                              if (this.settings.categoryPresets.theme == "gruvbox") {
                                  BdApi.injectCSS("gruvbox", gruvboxTheme);
                              }
                              if (this.settings.categoryPresets.theme == "tokyonight") {
                                  BdApi.injectCSS("tokyonight", tokyonightTheme);
                              }
                              if (this.settings.categoryPresets.theme == "onedark") {
                                  BdApi.injectCSS("onedark", onedarkTheme);
                              }
                              if (this.settings.categoryPresets.theme == "ultra") {
                                  BdApi.injectCSS("ultra", ultraTheme);
                              }
                              if (this.settings.categoryPresets.theme == "default") {
                                  BdApi.clearCSS("nord");
                                  BdApi.clearCSS("gruvbox");
                                  BdApi.clearCSS("tokyonight");
                                  BdApi.clearCSS("onedark");
                                  BdApi.clearCSS("ultra");
                              }

                              // Clear
                              if (!this.settings.categoryPresets.theme == "nord") {
                                  BdApi.clearCSS("nord");
                              }
                              if (!this.settings.categoryPresets.theme == "gruvbox") {
                                  BdApi.clearCSS("gruvbox");
                              }
                              if (!this.settings.categoryPresets.theme == "tokyonight") {
                                  BdApi.clearCSS("tokyonight");
                              }
                              if (!this.settings.categoryPresets.theme == "onedark") {
                                  BdApi.clearCSS("onedark");
                              }
                              if (!this.settings.categoryPresets.theme == "ultra") {
                                  BdApi.clearCSS("ultra");
                              }
                              BdApi.clearCSS("editor");
                          }

                          if (!this.settings.categoryPresets.enablePresets) {
                              BdApi.clearCSS("nord");
                              BdApi.clearCSS("gruvbox");
                              BdApi.clearCSS("tokyonight");
                              BdApi.clearCSS("onedark");
                              BdApi.clearCSS("ultra");
                          }

                          if (this.settings.categoryEditor.enableEditor) {
                              BdApi.injectCSS("editor", editorTheme);
                              BdApi.clearCSS("nord");
                              BdApi.clearCSS("gruvbox");
                              BdApi.clearCSS("tokyonight");
                              BdApi.clearCSS("onedark");
                              BdApi.clearCSS("ultra");
                              BdApi.clearCSS("buttons");
                          }

                          Logger.log("Injected");
                      }

                      onSwitch() {
                          const channelId = SelectedChannelStore.getChannelId();
                          if (this.lastChannelId === channelId) return;
                          this.addButtons();

                          this.lastChannelId = channelId;
                      }

                      async addButtons() {
                          const codeSelector = ".hljs";
                          const alreadyInjected = document.querySelector(".bettersyntax-buttons");
                          const buttonsCSS = `.tooltipBlack-vMYxvw .tooltipPointer-3L49xb {border-top-color: var(--background-floating) !important;} .tooltipBlack-vMYxvw {background-color: var(--background-floating) !important;} .bettersyntax-buttons {margin-left: auto; margin-top: 3px; height: 15px; width: fit-content;} .bettersyntax-copy {background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjIgMiAyMCAyMCI+CiAgPHBhdGggZD0iTSAxMiAyIEMgNi40ODYgMiAyIDYuNDg3IDIgMTIgQyAyIDE3LjUxNSA2LjQ4NiAyMiAxMiAyMiBDIDE3LjUxNCAyMiAyMiAxNy41MTUgMjIgMTIgQyAyMiA2LjQ4NyAxNy41MTQgMiAxMiAyIFogTSA3IDE5IEMgNiAxOSA2IDE5IDYgMTggQyA2IDggNiAxMCA2IDYgQyA2IDUgNiA1IDcgNSBMIDEzIDUgQyAxNSA1IDE1IDUgMTUgNiBMIDE3IDYgQyAxOCA2IDE4IDYgMTggNyBMIDE4IDE4IEMgMTggMTkgMTggMTkgMTcgMTkgQyAxNSAxOSAxNSAxOSAxNCAxOSBNIDE0IDE3IEwgMTUgMTcgQyAxNiAxNyAxNiAxNyAxNiAxNiBMIDE2IDE1IEwgMTYgOSBDIDE2IDggMTYgOCAxNSA4IEwgMTQgOCBNIDExIDE3IEMgMTIgMTcgMTIgMTcgMTIgMTYgTCAxMiA4IEMgMTIgNyAxMiA3IDExIDcgTCA5IDcgQyA4IDcgOCA3IDggOCBMIDggMTYgQyA4IDE3IDggMTcgOSAxNyBaIFoiIGZpbGw9IiNDMENBRjUiLz4KPC9zdmc+")}.bettersyntax-collapse {background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjIgMiAyMCAyMCI+CiAgPHBhdGggZD0iTSAxMiAyIEMgNi40ODYgMiAyIDYuNDg3IDIgMTIgQyAyIDE3LjUxNSA2LjQ4NiAyMiAxMiAyMiBDIDE3LjUxNCAyMiAyMiAxNy41MTUgMjIgMTIgQyAyMiA2LjQ4NyAxNy41MTQgMiAxMiAyIE0gNiA5IEwgMTggOSBMIDEyIDE2IFogWiBaIiBmaWxsPSIjQzBDQUY1Ii8+Cjwvc3ZnPg==")}.code-button {display: inline-flex; background-repeat: no-repeat; cursor: pointer; height: 15px; width: 15px;}.code-button:not(.code-button:nth-child(3)) {padding-right: 3px;}`;
                          const selectCSS = `::selection {background-color:transparent;}`;

                          if (!alreadyInjected) {
                              const codeBlocks = document.querySelectorAll(codeSelector);
                              for (let ele of codeBlocks) {
                                  const buttonsContainer = document.createElement("div");
                                  buttonsContainer.classList.add("bettersyntax-buttons");
                                  ele.appendChild(buttonsContainer);
                              }
                              const container = document.querySelectorAll(".bettersyntax-buttons");

                              for (let ele of container) {
                                  const queryContainer = document.createElement("div");
                                  queryContainer.classList.add("code-button");
                                  queryContainer.classList.add("bettersyntax-copy");
                                  ele.appendChild(queryContainer);

                                  const collapseContainer = document.createElement("div");
                                  collapseContainer.classList.add("code-button");
                                  collapseContainer.classList.add("bettersyntax-collapse");
                                  ele.appendChild(collapseContainer);
                              }
                          }

                          const selectQueryContainer = document.querySelectorAll(".bettersyntax-copy");
                          for (let ele of selectQueryContainer) {
                              if (!alreadyInjected) {
                                  Tooltip.create(ele, "Copy Code");
                              }

                              ele.addEventListener("click", async () => {
                                  const text = ele.parentElement.parentElement.textContent;
                                  DiscordNative.clipboard.copy(text);
                              });
                          }

                          const selectCollapseContainer = document.querySelectorAll(".bettersyntax-collapse");
                          for (let ele of selectCollapseContainer) {
                              if (!alreadyInjected) {
                                  Tooltip.create(ele, "Toggle Collapse");
                              }

                              ele.addEventListener("click", async () => {
                                  if (!ele.parentNode.parentNode.classList.contains("collapsed")) {
                                      ele.parentNode.parentNode.classList.add("collapsed");
                                  } else {
                                      ele.parentNode.parentNode.classList.remove("collapsed");
                                  }
                              });
                          }

                          BdApi.injectCSS("buttons", buttonsCSS);
                      }
                  };
              };

              return plugin(Plugin, Api);
          })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
