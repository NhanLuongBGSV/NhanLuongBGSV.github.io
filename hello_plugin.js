

const plugin = ({widgets, simulator, vehicle}) => {

    const container = document.createElement("div")
    container.setAttribute("style", `height: 100%; width: 100%;`)
    container.innerHTML = (`
    <div style="height:100px;padding: 20px; text-align: center;">
        <div style="font-size: 18px;">HeadLight: <span id="headlight">OFF</span></div>
        <div style="margin-top: 10px;font-size: 16px;">
            <button id="btn_head_light_on" style="padding: 8px; margin-left: 8px;background-color:blue;color:white;">ON</button>
            <button id="btn_head_light_off" style="padding: 8px; margin-left: 8px;background-color:red;color:white;">OFF</button>
        </div>
    </div>
    `)

    let lightState = divHeadLight.querySelector("#head_light")
    let btnLightOn = divHeadLight.querySelector("#btn_head_light_on")
    let btnLightOff = divHeadLight.querySelector("#btn_head_light_off")

    if(btnLightOn) {
        btnLightOn.addEventListener("click", () => {
            setLightStatus(true)
        })
    }

    if(btnLightOff) {
        btnLightOff.addEventListener("click", () => {
            setLightStatus(false)
        })
    }

    const setLightStatus = async (value) => {
        await vehicle['Body.Lights.IsHighBeamOn'].set(value)
    }

    setInterval(async () => {
        let value = await vehicle['Body.Lights.IsHighBeamOn'].get()
        lightState.innerHTML = value?'ON':'OFF'
    }, 1000)

    widgets.register("Headlight", 
        (box) => {
            box.injectNode(container)
        })

}

export default plugin