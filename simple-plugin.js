const plugin = ({widgets, simulator, vehicle}) => {

    let boxGlobal = null

    const container = document.createElement("div")
    container.setAttribute("style", `height: 100%; width: 100%;`)
    container.innerHTML = (`
    <div style="width: 100%;height:100%;background-color:yellow;padding: 20px; text-align: center;">
        <div style="color:red; font-size: 18px;">Vietnam</div>
    </div>
    `)

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

    const renderHeadLight = (value) => {
        if(lightState) {
            lightState.innerHTML = value
        }
    }

    const setLightStatus = async (value) => {
        console.log('setLightStatus ---------------------------')
        let payload = {
            'vid': 'rasp2',
            'model': 'model_A',
            'ctrlmsg': `HeadLight, ${value?'true':'false'}`
        };
        
        var formBody = [];
        for (var property in payload) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(payload[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
    
        let res = await fetch('https://ppwebapp.azurewebsites.net/vehicleRemoteControl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
    }

    const getLightStatus = async () => {
        console.log('getLightStatus ---------------------------')
        let payload = {
            'vid': 'rasp2',
            'model': 'model_A',
        };
        
        var formBody = [];
        for (var property in payload) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(payload[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
    
        let res = await fetch('https://ppwebapp.azurewebsites.net/getVehicleInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
        let vehicle_data = await res.json()
        console.log('vid return', vehicle_data)

        renderHeadLight(vehicle_data.HeadLight)
    }

    setInterval(async () => { 
        await getLightStatus()
    }, 2000)

    widgets.register("Image", 
        (box) => {
            box.injectNode(container)
        })

    widgets.register("HeadLight", 
    (box) => {
        box.injectNode(divHeadLight)
    })

}

export default plugin