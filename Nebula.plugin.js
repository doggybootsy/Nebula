/**
 * @name Nebula
 * @description Round, Deep sea blue, consistent, Nebula!
 * @version 1.2.2
 * @author Lorem#3481
 */

module.exports = class Nebula {
    start() {
        BdApi.injectCSS("nebula-import", "@import url(\"https://rawcdn.githack.com/Loremly/Nebula/da500ed4f1985134c367f5602637067bac2117e8/index.css\");")
        const HeaderBarContainer = BdApi.findModuleByDisplayName("HeaderBarContainer").prototype,
            classes = BdApi.findModuleByProps("iconWrapper","clickable"),
            tooltip = BdApi.findModuleByProps("TooltipContainer").TooltipContainer,
            left = BdApi.findModuleByProps("guilds", "container", "sidebar")
        BdApi.Patcher.after("nebula-inject", HeaderBarContainer, "render", (_, res) => {
            res.props.children.splice(0, 0, 
                BdApi.React.createElement(tooltip, {
                    text: "Hide", 
                    position: "bottom",
                    children: [
                        BdApi.React.createElement("div", {
                            className: `nebula-arrow ${classes.iconWrapper} ${classes.clickable}`,
                            onClick: () => {
                                document.getElementsByClassName(left.guilds)[0].classList.toggle("active")
                                document.getElementsByClassName(left.sidebar)[0].classList.toggle("active")
                                document.querySelector(".nebula-arrow").classList.toggle("active")
                            },
                            children: [
                                BdApi.React.createElement("svg", {
                                    width: "24",
                                    height: "24",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    children: [
                                        BdApi.React.createElement("path", {
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
    }
    stop() {
        BdApi.Patcher.unpatchAll("nebula-inject")
        BdApi.clearCSS("nebula-import")
    }
}