const plugin = ({widgets, simulator, vehicle}) => {
    const divHeadLight = document.createElement("div")
    divHeadLight.setAttribute("style", `height: 100%; width: 100%;`)
    divHeadLight.innerHTML = (`
    <div style="width: 100%;height:100%;background-color:white;padding: 20px; text-align: center;">
        <div style="color:green; font-size: 20px;">HeadLight: <span id='head_light'>FALSE</span></div>
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
            console.log('btnLightOn click')
            setLightStatus(true)
        })
    }
    if(btnLightOff) {
        btnLightOff.addEventListener("click", () => {
            console.log('btnLightOff click')
            setLightStatus(false)
        })
    }
    const setLightStatus = async (value) => {
        await vehicle['Body.Lights.IsHighBeamOn'].set(value)
    }

    const renderHeadLight = (value) => {
        if(lightState) {
            lightState.innerHTML = value
        }
    }

    // setInterval(async () => {
    //     let value = await vehicle['Body.Lights.IsHighBeamOn'].get()
    //     renderHeadLight(value)
    // }, 1000)

    simulator("Vehicle.Body.Lights.IsHighBeamOn", "set", ({args}) => {
        console.log("On Vehicle.Body.Lights.IsHighBeamOn be set")
        console.log(args)
        const [value] = args
        console.log('value', value)
        renderHeadLight(value)
    })



    widgets.register("HeadLight", 
    (box) => {
        box.injectNode(divHeadLight)
    })

}


export default plugin