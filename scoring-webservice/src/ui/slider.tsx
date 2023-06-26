"use client"
import { useEffect, useState } from "react"


export default function Slider(id: number) {
    const [value, setValue] = useState(50)

    const sliderID = "slider-" + id
    const tooltipID = "tooltip-" + id

    useEffect(() => {
        const range = document.getElementById(sliderID);
        const tooltip = document.getElementById(tooltipID);

        if (range == null) {
            console.warn("Error retrieving range")
        }
        else if (tooltip == null) {
            console.warn("Error retrieving tooltip")
        }
        else {
            console.log(range.value)
            let thumbSize = 8;
            const ratio = (range.value - range.min) / (range.max - range.min)
            let amountToMove = ratio * ((range.offsetWidth - thumbSize) - thumbSize) + thumbSize
            tooltip.style.left = amountToMove + "px"
        }
    }, [value]);

    return (
        <>
            <div className="range-wrap relative flex h-24px w-full items-center">
                <input type="range"
                    aria-valuemax={0}
                    className="range relative flex w-full"
                    min="0"
                    max="100"
                    value={value}
                    id={sliderID}
                    onChange={({ target: { value: radius } }) => {
                        var stringToNumber = +radius
                        setValue(stringToNumber)
                    }}
                />
                <div id="progress"></div>
                <div
                    id={tooltipID}
                    className="bubble absolute top-[-40px] left-1/2 flex h-[38px] w-[32px] -translate-x-1/2 items-center justify-center rounded-full bg-purple-400 align-middle text-body-medium text-white"
                >
                    {value}
                </div>
            </div>
        </>
    );
}