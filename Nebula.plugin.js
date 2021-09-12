/**
 * @name Nebula
 * @description Round, Deep sea blue, consistent, Nebula!
 * @version 1.2.2
 * @author Lorem#3481
 */
const {Patcher: {after, unpatchAll}, alert, findModuleByProps, findModuleByDisplayName, Plugins:{isEnabled, get}, clearCSS, injectCSS, React: {createElement}, showToast} = BdApi,
    request = require('request')
module.exports = class Nebula {
    start() {
        // If zlib use updater
        if(global.ZeresPluginLibrary)
            global.ZeresPluginLibrary.PluginUpdater.checkForUpdate("Nebula", get("Nebula").version, "https://raw.githubusercontent.com/doggybootsy/Nebula/main/Nebula.plugin.js")
        // Add button
        const HeaderBarContainer = findModuleByDisplayName("HeaderBarContainer")?.prototype,
            classes = findModuleByProps("iconWrapper","clickable"),
            tooltip = findModuleByProps("TooltipContainer")?.TooltipContainer,
            left = findModuleByProps("guilds", "container", "sidebar")
        after("nebula-inject", HeaderBarContainer, "renderLoggedIn", (thisObject, _, res) => {
            console.log(res);
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
        })
        // Fetch css | no githack
        request("https://raw.githubusercontent.com/Loremly/Nebula/main/index.css", (error, res, body) => {
            if(error)alert("Nebula", "Couldn't fetch css")
            else injectCSS("nebula-import", body)
        })
    }
    stop() {
        // Undo
        unpatchAll("nebula-inject")
        clearCSS("nebula-import")
        for(const ite of document.querySelectorAll(".active"))ite?.classList?.toggle("active")
    }
}
