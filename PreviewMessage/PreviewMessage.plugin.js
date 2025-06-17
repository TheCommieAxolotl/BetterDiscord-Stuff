/**
 * @name PreviewMessage
 * @author TheCommieAxolotl
 * @description Allows you to preview a message before you send it.
 * @version 1.0.4
 * @authorId 538487970408300544
 * @invite 5BSWtSM3XU
 * @source https://github.com/TheCommieAxolotl/BetterDiscord-Stuff/tree/main/PreviewMessage
 * @updateurl https://raw.githubusercontent.com/TheCommieAxolotl/BetterDiscord-Stuff/main/PreviewMessage/PreviewMessage.plugin.js
 * @donate https://github.com/sponsors/thecommieaxolotl
 */

const { React, Patcher, Webpack } = BdApi;

const SelectedChannelStore = Webpack.getStore("SelectedChannelStore");
const DraftStore = Webpack.getStore("DraftStore");
const MessageActions = Webpack.getModule((m) => m.sendBotMessage);

const ChatButtonsGroup = BdApi.Webpack.getBySource("\"ChannelTextAreaButtons\"").Z;
const ChatButton = BdApi.Webpack.getBySource("CHAT_INPUT_BUTTON_NOTIFICATION").Z;

var console;

module.exports = class PreviewMessage {
    constructor(meta) {
        this.meta = meta;
        this.BdApi = new BdApi(meta.name);
        console = this.BdApi.Logger;
    }

    start() {
        Patcher.after(this.meta.name, ChatButtonsGroup, "type", (_, __, res) => {
            if (res.props.children && Array.isArray(res.props.children)) {
                res.props.children.unshift(React.createElement(this.PreviewMessageButton));
            }
        });
    }

    stop() {
        Patcher.unpatchAll(this.meta.name);
    }

    sendPreview() {
        const channelID = SelectedChannelStore.getChannelId();

        const draft = DraftStore.getDraft(channelID, 0);

        if (draft) {
            MessageActions.sendBotMessage(channelID, draft);
        }
    }

    PreviewMessageButton = () => {
        return React.createElement(ChatButton, {
            onClick: () => this.sendPreview(), "aria-label": "Preview Message",
            children: React.createElement("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 36 36",
                width: "20",
                height: "20"
            }, 
            [
                React.createElement("ellipse", { fill: "currentColor", cx: "8.828", cy: "18", rx: "7.953", ry: "13.281", key: 1 }),
                React.createElement("path", { fill: "currentColor", d: "M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z", key: 2 }),
                React.createElement("circle", { fill: "black", cx: "6.594", cy: "18", r: "4.96", key: 3 }),
                React.createElement("circle", { fill: "black", cx: "6.594", cy: "18", r: "3.565", key: 4 }),
                React.createElement("circle", { fill: "currentColor", cx: "7.911", cy: "15.443", r: "1.426", key: 5 }),
                React.createElement("ellipse", { fill: "currentColor", cx: "27.234", cy: "18", rx: "7.953", ry: "13.281", key: 6 }),
                React.createElement("path", { fill: "currentColor", d: "M27.234 32.031c-4.88 0-8.703-6.163-8.703-14.031s3.823-14.031 8.703-14.031S35.938 10.132 35.938 18s-3.824 14.031-8.704 14.031zm0-26.562c-3.972 0-7.203 5.622-7.203 12.531 0 6.91 3.231 12.531 7.203 12.531S34.438 24.91 34.438 18 31.206 5.469 27.234 5.469z", key: 7 }),
                React.createElement("circle", { fill: "black", cx: "25", cy: "18", r: "4.96", key: 8 }),
                React.createElement("circle", { fill: "black", cx: "25", cy: "18", r: "3.565", key: 9 }),
                React.createElement("circle", { fill: "currentColor", cx: "26.317", cy: "15.443", r: "1.426", key: 10 })
            ])
        });
    }
};
