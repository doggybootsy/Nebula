/**
 * @name Nebula
 * @description Round, Deep sea blue, consistent, Nebula!
 * @version 1.0.0
 * @author Lorem#3481 & doggybootsy
 * @source https://raw.githubusercontent.com/doggybootsy/Nebula/main/Nebula.plugin.js
 */
const {Patcher, alert, findModuleByProps, saveData, loadData, findModuleByDisplayName, Plugins:{isEnabled, get}, clearCSS, injectCSS, React, showToast} = BdApi,
    SwitchItem = findModuleByDisplayName("SwitchItem"),
    request = require("request")
class Switch extends React.Component {
    constructor() {
        super(...arguments)
        this.state = { toggled: loadData("Nebula", "Button") ?? true }
    }
    render() {
        return React.createElement(SwitchItem, {
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
        Patcher.unpatchAll("nebula-inject")
        // Add button
        const HeaderBarContainer = findModuleByDisplayName("HeaderBarContainer")?.prototype,
            classes = findModuleByProps("iconWrapper","clickable"),
            tooltip = findModuleByProps("TooltipContainer")?.TooltipContainer,
            left = findModuleByProps("guilds", "container", "sidebar")
        Patcher.after("nebula-inject", HeaderBarContainer, "renderLoggedIn", (thisObject, _, res) => {
            if (loadData("Nebula", "Button") === true) {
                res?.props?.children.splice(0, 0, 
                    React.createElement(tooltip, {
                        text: "Hide", 
                        position: "bottom",
                        children: [
                            React.createElement("div", {
                                className: ["nebula-arrow",classes?.iconWrapper,classes?.iconWrapper].join(" "),
                                onClick: () => {
                                    if(isEnabled("Nebula") === true && loadData("Nebula", "Button") === true)for(const ite of [left?.guilds,left?.sidebar,"nebula-arrow"])document.getElementsByClassName(ite)[0]?.classList?.toggle("active")
                                    else {
                                        document.querySelector(".nebula-arrow").remove()
                                        loadData("Nebula", "Button") === false ? showToast("Collpsable button is disabled", {type:"warning", icon: true}) : showToast("Nebula is disabled", {type:"warning", icon: true})
                                    }
                                },
                                children: [
                                    React.createElement("svg", {
                                        width: "24",
                                        height: "24",
                                        viewBox: "0 0 24 24",
                                        fill: "var(--interactive-normal)",
                                        children: [
                                            React.createElement("path", {
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
        document.body.classList.add("nebula")
        this.patch()
        console.log("%c[Nebula has started]","background: #25294a; color: #d8dee9; font-size: 1.25em; padding: .2rem; border-radius: .35rem")
        // Fetch css | no githack
        request("https://raw.githubusercontent.com/Loremly/Nebula/main/index.css", (error, res, body) => {
            if(error) alert("Nebula", "Couldn't fetch css")
            else {
                injectCSS("nebula-import", body)
                showToast("Nebula was successfully imported", {type:"info", icon: true})
            }
        })
    }
    getSettingsPanel() {return React.createElement(Switch, {instance: this})}
    stop() {
        document.body.classList.remove("nebula")
        // Undo
        if(document.querySelector(".nebula-arrow"))document.querySelector(".nebula-arrow").remove()
        Patcher.unpatchAll("nebula-inject")
        clearCSS("nebula-import")
        for(const ite of document.querySelectorAll(".active"))ite?.classList?.toggle("active")
    }
}
