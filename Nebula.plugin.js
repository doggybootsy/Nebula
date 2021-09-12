/**
 * @name Nebula
 * @description Round, Deep sea blue, consistent, Nebula!
 * @version 1.2.2
 * @author Lorem#3481 & doggybootsy
 */
const {Patcher: {after, unpatchAll}, alert, findModuleByProps, saveData, loadData, findModuleByDisplayName, Plugins:{isEnabled, get}, clearCSS, injectCSS, React: {createElement, Component}, showToast} = BdApi,
    SwitchItem = findModuleByDisplayName("SwitchItem"),
    request = require("request")
class Switch extends Component {
    constructor() {
        super(...arguments)
        this.state = { toggled: loadData("Nebula", "Button") ?? true }
    }
    render() {
        return createElement(SwitchItem, {
            value: this.state.toggled,
            children: "Collpsable button",
            note: "Adds a button to collapse the left side of discord",
            onChange: (value) => {
                this.setState({ toggled: value })
                saveData("Nebula", "Button", value)
                this.props.instance.patch()
            }
        })
    } 
}
module.exports = class Nebula {
    patch() {
        unpatchAll("nebula-inject")
        // Add button
        const HeaderBarContainer = findModuleByDisplayName("HeaderBarContainer")?.prototype,
            classes = findModuleByProps("iconWrapper","clickable"),
            tooltip = findModuleByProps("TooltipContainer")?.TooltipContainer,
            left = findModuleByProps("guilds", "container", "sidebar")
        after("nebula-inject", HeaderBarContainer, "renderLoggedIn", (thisObject, _, res) => {
            if (loadData("Nebula", "Button") === true) {
                res?.props?.children.splice(0, 0, 
                    createElement(tooltip, {
                        text: "Hide", 
                        position: "bottom",
                        children: [
                            createElement("div", {
                                className: ["nebula-arrow",classes?.iconWrapper,classes?.iconWrapper].join(" "),
                                onClick: () => {
                                    if(isEnabled("Nebula") === true)for(const ite of [left?.guilds,left?.sidebar,"nebula-arrow"])document.getElementsByClassName(ite)[0]?.classList?.toggle("active")
                                    else showToast("Nebula is disabled", {type:"warning", icon: true})
                                },
                                children: [
                                    createElement("svg", {
                                        width: "24",
                                        height: "24",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        children: [
                                            createElement("path", {
                                                d: "M15.535 3.515L7.05005 12L15.535 20.485L16.95 19.071L9.87805 12L16.95 4.929L15.535 3.515Z"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                )
            }
        })
    }
    start() {
        // If zlib use updater
        if(global.ZeresPluginLibrary)
            global.ZeresPluginLibrary.PluginUpdater.checkForUpdate("Nebula", get("Nebula").version, "https://raw.githubusercontent.com/doggybootsy/Nebula/main/Nebula.plugin.js")
        this.patch()
        // Fetch css | no githack
        request("https://raw.githubusercontent.com/Loremly/Nebula/main/index.css", (error, res, body) => {
            if(error)alert("Nebula", "Couldn't fetch css")
            else injectCSS("nebula-import", body)
        })
    }
    getSettingsPanel() {return createElement(Switch, {instance: this})}
    stop() {
        // Undo
        unpatchAll("nebula-inject")
        clearCSS("nebula-import")
        for(const ite of document.querySelectorAll(".active"))ite?.classList?.toggle("active")
    }
}
