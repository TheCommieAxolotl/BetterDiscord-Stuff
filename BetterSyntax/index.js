const { Styling, React, showToast, Patcher, Logger, WebpackModules, VelocityElements } = VApi;

const nordTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:#81A1C1 !important}.hljs-function .hljs-title{color:#8FBCBB !important}code.hljs{background-color:#2E343F}.hljs-selector-class{color:#8FBCBB}.hljs-number{color:#B48EAD}.hljs-attribute{color:#D8DEE9}.hljs-built_in{color:#88C0D0}.hljs, .hljs + .bettersyntax-buttons{color:#81A1C1}.hljs-meta{color:#81A1C1}.hljs-string{color:#A3BE8C}.hljs-literal{color:#81A1C1}.hljs-selector-pseudo{color:#8FBCBB}.hljs-comment{color:#616E88}.hljs-bullet,.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol{color:#8FBCBB}`;
const gruvboxTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:#FB4934 !important}.hljs-title{color:#FABD2F !important}.hljs-function .hljs-title{color:#FABD2F !important}code.hljs{background-color:#282828}.hljs-selector-class{color:#B8BB26}.hljs-number{color:#D3869B}.hljs-attribute{color:#FE8019}.hljs-built_in{color:#FB4934}.hljs, .hljs + .bettersyntax-buttons{color:#EBDBB2}.hljs-meta{color:#FB4934}.hljs-string{color:#B8BB26}.hljs-literal{color:#FB4934}.hljs-selector-pseudo{color:#FABD2F}.hljs-comment{color:#928374}.hljs-doctag{color:#83A598}.hljs-bullet,.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol{color:#FB4934}`;
const tokyonightTheme = `.hljs-addition,.hljs-keyword,.hljs-selector-tag{color:#BB9AF7 !important}.hljs-function .hljs-title{color:#7AA2F7 !important}code.hljs{background-color:#1A1B26}.hljs-selector-class{color:#9ECE6A}.hljs-number{color:#FF9E64}.hljs-attribute{color:#7AA2F7}.hljs-built_in:not(.hljs-params *) {color: #0DB9D7;}.hljs-params, .hljs-params * {color: #E0AF68 !important;}.hljs, .hljs + .bettersyntax-buttons{color:#C0CAF5}.hljs-meta{color:#81A1C1}.hljs-string{color:#9ECE6A}.hljs-literal{color:#81A1C1}.hljs-selector-pseudo{color:#BB9AF7}.hljs-comment{color:#444B6A}.hljs-link,.hljs-selector-attr,.hljs-subst,.hljs-symbol,.hljs-bullet{color:#BB9AF7}`;
const onedarkTheme = `.hljs, .hljs + .bettersyntax-buttons{color:#abb2bf;background:#282c34 !important;}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}.hljs-built_in:not(.hljs-params *){color:#E06C75}.hljs-params, .hljs-params *{color: #61AFEF !important}.hljs-function{color:#E5C07B}`;
const ultraTheme = `.hljs, .hljs + .bettersyntax-buttons{color:#dcddde;background:#17161b !important;}.hljs-comment,.hljs-quote{color:#b9bbbe;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#6e6af6}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#eb8181}.hljs-literal{color:#ffce97}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#97ffa5}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#fdff97}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#97aaff}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}`;

const Themes = [
    { name: "Default", desc: "Discord's default colors", value: "default", css: "" },
    { name: "Nord Theme", value: "nord", css: nordTheme },
    { name: "Gruvbox Theme", value: "gruvbox", css: gruvboxTheme },
    { name: "OneDark Theme", value: "onedark", css: onedarkTheme },
    { name: "Tokyo Night Theme", value: "tokyonight", css: tokyonightTheme },
    { name: "Ultra Theme", value: "ultra", css: ultraTheme },
];

module.exports = {
    Plugin: new (class {
        config = {
            info: {
                name: "BetterSyntax",
                description: "Lets you edit Syntax Highlighting with an easy interface and adds some useful buttons.",
            },
            author: "TheCommieAxolotl",
            authorId: "538487970408300544",
            version: "1.0.0",
            license: "MIT",
        };
        getName() {
            return this.config.info.name;
        }

        getSettingsPanel() {
            return [
                {
                    type: "input",
                    plugin: "BetterSyntax",
                    setting: "theme",
                    name: "Theme",
                    note: "default, nord, gruvbox, onedark, tokyonight, ultra",
                    placeholder: "default",
                    vertical: true,
                    action: () => this.injectCSS(),
                },
                {
                    type: "input",
                    plugin: "BetterSyntax",
                    setting: "fontImport",
                    name: "Font Import",
                    placeholder: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@550&display=swap",
                    note: "URL to import",
                    vertical: true,
                    action: () => this.injectCSS(),
                },
                {
                    type: "input",
                    plugin: "BetterSyntax",
                    setting: "fontSize",
                    name: "Font Size",
                    note: "Number. Default: 0.875rem",
                    placeholder: "0.875rem",
                    vertical: true,
                    action: () => this.injectCSS(),
                },
                {
                    type: "input",
                    plugin: "BetterSyntax",
                    setting: "fontName",
                    name: "Font Name",
                    note: "Exact Font Name",
                    placeholder: "Source Code Pro",
                    vertical: true,
                    action: () => this.injectCSS(),
                },
            ];
        }

        async onStart() {
            this.injectCSS();
            this.addButtons();
        }

        onStop() {
            Themes.forEach((theme) => Styling.clearCSS(theme.value));

            Styling.clearCSS("BetterSyntaxCSS");
            Styling.clearCSS("BetterSyntaxButtons");
            Patcher.unpatchAll(this.getName());
        }

        injectCSS() {
            const BetterSyntaxCSS = `@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@550&display=swap");@import url("${
                this.settings?.fontImport || ""
            }");.bettersyntax-tip{color:var(--header-secondary);font-weight:500;font-family:var(--font-display);text-transform:uppercase;font-size:12px;margin-bottom:10px}code.hljs{font-size:${
                this.settings?.fontSize || "0.875rem"
            };font-family:"${
                this.settings?.fontName || "Source Code Pro"
            }"}.hljs{border-radius:4px;margin-bottom:10px !important;border:none !important}.collapsed > .hljs,.collapsed > .hljs *{color:transparent !important}.collapsed > .hljs{min-height:28px;max-height:28px;font-size:0;display:flex}.collapsed > .hljs .bettersyntax-buttons{margin-right:7px;margin-top:6px;pointer-events:all;top:10px}.collapsed > .hljs::before{color:white;content:"Collapsed codeblock";width:76%;height:28px;text-align:center;font-size:10pt;position:absolute;padding-top:5.5px;font-family:var(--font-primary);font-weight:500}.layerContainer-2v_Sit code.hljs{margin:15px}`;

            if (!VelocityElements.head.querySelector("#BetterSyntaxCSS")) {
                Styling.injectCSS("BetterSyntaxCSS", BetterSyntaxCSS);
            }

            Themes.forEach((theme) => Styling.clearCSS(theme.value));
            Themes.forEach((theme) => {
                if (this.settings?.theme.toLocaleLowerCase() == theme.value) {
                    Styling.injectCSS(theme.value, theme.css);
                } else {
                    Styling.clearCSS(theme.value);
                }
            });
        }

        async addButtons() {
            const { codeBlock } = WebpackModules.findByProps("parse", "parseTopic").defaultRules;

            const Tooltip = WebpackModules.find("Tooltip").default;

            Patcher(this.getName, codeBlock, "react", ([props], parRes) => {
                if (props.type !== "codeBlock") return;

                Patcher.after(this.getName(), parRes.props, "render", (newProps, res) => {
                    res.props.children = [
                        res.props.children,
                        React.createElement("div", {
                            className: "bettersyntax-buttons",
                            children: [
                                React.createElement(Tooltip, {
                                    text: props.lang ? `Language: ${props.lang.toUpperCase()}` : "Unknown Language",
                                    children: (p) =>
                                        React.createElement("div", {
                                            ...p,
                                            className: "code-button bettersyntax-lang",
                                            onClick: () => {
                                                DiscordNative.clipboard.copy(props.lang);
                                                showToast("BetterSyntax", "Copied Language", { type: "success" });
                                            },
                                            children: [
                                                React.createElement("svg", {
                                                    className: "icon",
                                                    viewBox: "2 2 20 20",
                                                    children: [
                                                        React.createElement("path", {
                                                            fill: "currentColor",
                                                            d: "M6.5 8Q6.5 7 7.5 7L11.5 7Q12.5 7 12.5 8T11.5 9L7.5 9Q6.5 9 6.5 8M13.5 8Q13.5 7 14.5 7 15.5 7 15.5 8T14.5 9 13.5 8zM6.5 11Q6.5 10 7.5 10L8.5 10Q9.5 10 9.5 11T8.5 12L7.5 12Q6.5 12 6.5 11M10.5 11Q10.5 10 11.5 10L15.5 10Q16.5 10 16.5 11T15.5 12L11.5 12Q10.5 12 10.5 11M6.5 14Q6.5 13 7.5 13L11.5 13Q12.5 13 12.5 14T11.5 15L7.5 15Q6.5 15 6.5 14M13.5 14Q13.5 13 14.5 13L17.5 13Q18.5 13 18.5 14T17.5 15L14.5 15Q13.5 15 13.5 14M6.5 17Q6.5 16 7.5 16L9.5 16Q10.5 16 10.5 17T9.5 18L7.5 18Q6.5 18 6.5 17",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                }),
                                React.createElement(Tooltip, {
                                    text: `Copy Code`,
                                    children: (p) =>
                                        React.createElement("div", {
                                            ...p,
                                            className: "code-button bettersyntax-copy",
                                            onClick: () => {
                                                DiscordNative.clipboard.copy(props.content);
                                                showToast("BetterSyntax", "Copied", { type: "success" });
                                            },
                                            children: [
                                                React.createElement("svg", {
                                                    className: "icon",
                                                    viewBox: "2 2 20 20",
                                                    children: [
                                                        React.createElement("path", {
                                                            fill: "currentColor",
                                                            d: "M12 2ZM7 19Q6 19 6 18C6 8 6 10 6 6Q6 5 7 5h6q1 0 1 1L15 6h2q1 0 1 1v11q0 1-1 1c-2 0-2 0-3 0m0-2h1q1 0 1-1V15 9Q16 8 15 8h-1m-3 9q1 0 1-1V8Q12 7 11 7H9Q8 7 8 8v8q0 1 1 1z",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                }),
                                React.createElement(Tooltip, {
                                    text: `Toggle Collapse`,
                                    children: (p) =>
                                        React.createElement("div", {
                                            ...p,
                                            className: "code-button bettersyntax-collapse",
                                            onClick: (ele) => {
                                                showToast("BetterSyntax", "Toggled Collapse");
                                                if (ele.target.tagName == "svg") {
                                                    if (!ele.target.parentNode.parentNode.parentNode.classList.contains("collapsed")) {
                                                        ele.target.parentNode.parentNode.parentNode.classList.add("collapsed");
                                                    } else {
                                                        ele.target.parentNode.parentNode.parentNode.classList.remove("collapsed");
                                                    }
                                                } else if (ele.target.tagName == "path") {
                                                    if (!ele.target.parentNode.parentNode.parentNode.parentNode.classList.contains("collapsed")) {
                                                        ele.target.parentNode.parentNode.parentNode.parentNode.classList.add("collapsed");
                                                    } else {
                                                        ele.target.parentNode.parentNode.parentNode.parentNode.classList.remove("collapsed");
                                                    }
                                                }
                                            },
                                            children: [
                                                React.createElement("svg", {
                                                    className: "icon",
                                                    viewBox: "2 2 20 20",
                                                    children: [
                                                        React.createElement("path", {
                                                            fill: "currentColor",
                                                            d: "M6 9h12l-6 7z",
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                }),
                            ],
                        }),
                    ];
                });
            });
            const buttonsCSS = `.code-button .icon > path {color: var(--background-primary);}.code-button {background: currentColor;border-radius: 10px;}.bettersyntax-buttons{margin-left:auto;margin-top:3px;height:17.5px;width:fit-content}.code-button{display:inline-flex;background-repeat:no-repeat;cursor:pointer;height:17.5px;width:17.5px}.code-button:not(.code-button:nth-child(3)){margin-right:5px}.bettersyntax-collapse{transition:transform 0.2s ease}.collapsed .bettersyntax-collapse{transform:rotate(180deg)}pre code.hljs + .bettersyntax-buttons{background:transparent !important}`;
            Styling.injectCSS("BetterSyntaxButtons", buttonsCSS);
        }
    })(),
};
