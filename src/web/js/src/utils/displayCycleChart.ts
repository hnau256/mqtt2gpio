import { Cycle } from "../cycle/cycle";
import { CycleItem } from "../cycle/cycleItem";
import { LifeScope } from "./lifeScope";
import { Observable } from "./observable/observable";
import { StateObservableExt } from "./observable/state/stateObservableExt";
import { createThemeObservable, Theme } from "./theme";

export function displayCycleChart(
    args: {
        lifeScope: LifeScope,
        cycle: Cycle,
    }
): Element {
    let theme = createThemeObservable()
    let colors = StateObservableExt.map({
        source: theme,
        lifeScope: args.lifeScope,
        transform: (theme) => (theme == Theme.Dark) ? darkColors : lightColors,
    })
    return createSvg({
        lifeScope: args.lifeScope,
        cycle: args.cycle,
        colors: colors,
    })
}

function createSvg(
    args: {
        lifeScope: LifeScope,
        colors: Observable<Colors>,
        cycle: Cycle,
    }
): Element {
    let result = createElement({
        name: "svg",
        attributes: [
            { name: "width", value: "100%" },
            { name: "viewBox", value: `0 0 1 ${height}` },
            { name: "fill", value: "none" },
            { name: "stroke-linecap", value: "round" },
            { name: "stroke-linejoin", value: "round" },
            { name: "font-size", value: titlesFontSize.toString() },
        ]
    })
    let totalDuration = 0
    let maxTemperature = 0
    args.cycle.items.forEach(
        (item) => {
            totalDuration += item.duration_minutes
            maxTemperature = (item.target > maxTemperature) ? item.target : maxTemperature
        }
    )
    if (totalDuration <= 0 || maxTemperature <= 0) {
        return result
    }

    let horizontalPadding = mainLineCircleRadius
    let minuteWidth = (1 - horizontalPadding * 2) / totalDuration
    let degeseHeight = (height - bottomPadding - mainLineCircleRadius * 2) / maxTemperature
    let zeroDegreseY = height - bottomPadding - mainLineCircleRadius

    let items: CycleItem[] = [
        {
            duration_minutes: 0,
            target: 0
        },
        ...args.cycle.items,
    ]

    let duration = 0
    let verticalLines: Element[] = []
    let titles: Element[] = []
    let mainLineCircles: Element[] = []
    let mainLinePoints: string = ""

    let setColorAttribute: (callback: (colors: Colors) => void) => void =
        (callback) => {
            args.colors.observe({
                lifeScope: args.lifeScope,
                callback: callback
            })
        }

    for (let i = 0; i < items.length; i++) {
        let first = i == 0
        let last = i == items.length - 1
        let item = items[i]
        let itemDuration = item.duration_minutes
        if (itemDuration <= 0 && !first) {
            continue
        }

        duration += itemDuration


        let x = horizontalPadding + duration * minuteWidth
        let y = zeroDegreseY - item.target * degeseHeight

        mainLinePoints += `${x} ${y}`
        if (!last) {
            mainLinePoints += " "
        }

        let mainLineCircle = createElement({
            name: "circle",
            attributes: [
                { name: "cx", value: x.toString() },
                { name: "cy", value: y.toString() },
                { name: "r", value: mainLineCircleRadius.toString() },
            ]
        })
        setColorAttribute((colors) => mainLineCircle.setAttribute("fill", colors.main))
        mainLineCircles.push(mainLineCircle)

        if (item.target > 0) {
            let verticalLine = createElement({
                name: "line",
                attributes: [
                    { name: "x1", value: x.toString() },
                    { name: "y1", value: y.toString() },
                    { name: "x2", value: x.toString() },
                    { name: "y2", value: (zeroDegreseY + verticalLineWidth / 2).toString() },
                    { name: "stroke-width", value: verticalLineWidth.toString() },
                ]
            })
            setColorAttribute((colors) => verticalLine.setAttribute("stroke", colors.additional))
            verticalLines.push(verticalLine)
        }

        let durationMinutes = duration
        let durationHours = Math.floor(durationMinutes / 60)
        durationMinutes -= durationHours * 60
        let durationString = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`;
        [
            {
                value: durationString,
                y: durationTitleY,
                color: (colors: Colors) => colors.additional
            },
            {
                value: item.target.toString() + 'C°',
                y: temperatureTitleY,
                color: (colors: Colors) => colors.main
            },
        ].forEach(
            valueWithYWithColor => {
                let title = createElement({
                    name: "text",
                    attributes: [
                        { name: "x", value: x.toString() },
                        { name: "y", value: (height - valueWithYWithColor.y).toString() },
                        { name: "text-anchor", value: first ? "start" : (last ? "end" : "middle") },
                    ]
                })
                title.setHTMLUnsafe(valueWithYWithColor.value)
                setColorAttribute((colors) => title.setAttribute("fill", valueWithYWithColor.color(colors)))
                titles.push(title)
            }
        )
    }

    result.append(...verticalLines)
    let mainLine = createElement({
        name: "polyline",
        attributes: [
            { name: "points", value: mainLinePoints },
            { name: "stroke-width", value: mainLineWidth.toString() },
        ]
    })
    setColorAttribute((colors) => mainLine.setAttribute("stroke", colors.main))
    result.appendChild(mainLine)
    result.append(...mainLineCircles)
    result.append(...titles)
    return result
}

function createElement(
    args: {
        name: string,
        attributes?: { name: string, value: string }[]
    }
): Element {
    let result = document.createElementNS("http://www.w3.org/2000/svg", args.name)
    args.attributes?.forEach(
        (nameWithValue) =>
            result.setAttribute(nameWithValue.name, nameWithValue.value)
    )
    return result
}

const height = 0.4
const bottomPadding = 0.07
const mainLineWidth = 0.01
const mainLineCircleRadius = 0.01
const verticalLineWidth = 0.003
const titlesFontSize = 0.03
const durationTitleY = 0
const temperatureTitleY = 0.035

type Colors = {
    main: string,
    additional: string,
}

let darkColors: Colors = {
    main: "#ffbf00",
    additional: "#c2c7d0",
}

let lightColors: Colors = {
    main: "#ffbf00",
    additional: "#373c44",
}