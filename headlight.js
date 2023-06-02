const plugin = ({ widgets, simulator, vehicle }) => {
    const engineBtn = document.createElement("div");
    engineBtn.setAttribute("style", `height: 100%; width: 100%;`);
    engineBtn.innerHTML = `
     <div>
      <div style="position: relative !important;">
      <div id="offBtn" style="position: absolute; top: 70px; left: 50%; transform: translate(-50%, -50%); width: 40px ;height: 16px; border: 1px solid black ;border-radius: 500px; opacity: 0.9;
      background-color: red;"></div>
      <img
        id="startBtn"
        style="width: 96%"
        src="https://png.pngtree.com/png-vector/20210414/ourlarge/pngtree-car-start-button-png-image_3173516.jpg"
      />
  
      <div id="activeBtn" style="position: absolute"></div>
    </div>
  
        <style>
        @keyframes click-effect {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }
  
        #startBtn {
          transition: transform 0.1s ease-in-out;
        }
        
        #startBtn:active {
          animation: click-effect 0.1s ease-in-out;
        }
  
      *{
        text-align: center;
      }
  
      .pill {
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 16px;
        border: 3px solid #cde1d2;
        background-color: #5ec473;
        border-radius: 500px;
        opacity: 0.9;
        box-shadow: 0 0 5px #cde1d2;
      }
  
          </style>
      </div>
      `;

    const divHeadLight = document.createElement("div");
    divHeadLight.setAttribute("style", `height: 100%; width: 100%;`);
    divHeadLight.innerHTML = `
     <div>
     <div style="position: relative; display:flex;">
          <img
            style="width:"100px""
            class="background-image"
            src="https://haynes.com/en-gb/sites/default/files/styles/haynes_large/public/web_What%20are%20the%20types%20of%20light%20on%20a%20vehicle_0_1.jpg?itok=FO6uieHx&timestamp=1592563451"
          />
          <img
            id="left_light"
            src="https://www.nicepng.com/png/full/44-443005_making-lists-light-flash-gif-png.png"
            alt="Transparent Light Png - Transparent Background Gold Light Png, Png Download@kindpng.com"
            style="
            width: 200px;
            position: absolute;  
            top: 49px;
            left: 198px;  
            opacity: 1;
            visibility: hidden;
            "
          />
          <img
            id="right_light"
            src="https://www.nicepng.com/png/full/44-443005_making-lists-light-flash-gif-png.png"
            alt="Transparent Light Png - Transparent Background Gold Light Png, Png Download@kindpng.com"
            style="
            width: 200px;
            position: absolute;  
            top: 47px;
            right: -7px;
            opacity: 1;
            visibility: hidden;
            "
          />
      </div>
      <div>
          <div style="width: 100%;">
              <p>Light Intensity: <span id="lightValue"></span></p>
              <input type="range" min="0" max="100" value="50" id="lightRange"
            style="
            -webkit-appearance: none;
            appearance: none; 
            width: 50%;
            cursor: pointer;
            outline: none;
            border-radius: 15px;
            height: 9px;
            background: #efefef;
            border: 1px solid #00000042;
            ">
        </div>
        <div>
            <p class="test" >Rain Intensity: <span id="rainValue"></span></p>
            <input type="range" min="0" max="100" value="50" id="rainRange" style="
            -webkit-appearance: none;
            appearance: none; 
            width: 50%;
            cursor: pointer;
            outline: none;
            border-radius: 15px;
            height: 9px;
            background: #efefef;
            border: 1px solid #00000042;
            ">
        </div>
    </div>
   </div>

 

      <style>

      #lightRange::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none; 
        height: 30px;
        width: 30px;
        background: transparent;
        background-image: url("https://cdn.pixabay.com/photo/2017/02/19/22/16/sun-2081066_960_720.png");
        background-size: cover;
        background-radius: 50%;
        transition: .2s ease-in-out;
    }

    #lightRange::-moz-range-thumb {
        height: 30px;
        width: 30px;
        background: transparent;
        background-image: url("https://cdn.pixabay.com/photo/2017/02/19/22/16/sun-2081066_960_720.png");
        background-size: cover;
        border: none;
        transition: .2s ease-in-out;
        }

      #rainRange::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none; 
        height: 30px;
        width: 30px;  
        background: transparent;
        background-image: url("https://cdn.pixabay.com/photo/2017/02/16/19/38/water-2072211_960_720.png");
        background-size: 25px 27px;
        transition: .2s ease-in-out;
        background-repeat: no-repeat;
    }

    #rainRange::-moz-range-thumb {
        height: 30px;
        width: 30px;
        background: transparent;
        background-image: url("https://cdn.pixabay.com/photo/2014/04/02/10/57/water-305029_960_720.png");
        background-size: cover;
        border: none;
        transition: .2s ease-in-out;
        }

      @keyframes click-effect {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.8);
        }
        100% {
          transform: scale(1);
        }
      }
      #startBtn {
        transition: transform 0.1s ease-in-out;
      }
      
      #startBtn:active {
        animation: click-effect 0.5s ease-in-out;
      }

    *{
      text-align: center;
    }

    .pill {
      top: 33.5%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 39px;
      height: 11px;
      border: 3px solid #cde1d2;
      background-color: #5ec473;
      border-radius: 500px;
      opacity: 0.9;
      box-shadow: 0 0 5px #cde1d2;
    }

        </style>
    </div>
    `;

    let left_light = divHeadLight.querySelector("#left_light");
    let right_light = divHeadLight.querySelector("#right_light");

    let light = divHeadLight.querySelector("#lightRange");
    let rain = divHeadLight.querySelector("#rainRange");
    let lightValue = divHeadLight.querySelector("#lightValue");
    let rainValue = divHeadLight.querySelector("#rainValue");
    let startBtn = engineBtn.querySelector("#startBtn");
    let activeBtn = engineBtn.querySelector("#activeBtn");


    /*Range Slider */
    //Set value
    lightValue.innerHTML = light.value;
    light.oninput = function () {
        lightValue.innerHTML = this.value;
    };
    rainValue.innerHTML = rain.value;
    rain.oninput = function () {
        rainValue.innerHTML = this.value;
    };

    //Set background depends on the thumb
    const initialLightValue = light.value;
    const initialLightPosition =
        ((initialLightValue - light.min) / (light.max - light.min)) * 100;
    light.style.background = `linear-gradient(to right, #0075ff 0%, #0075ff ${initialLightPosition}%, #efefef ${initialLightPosition}%, #efefef 100%)`;
    light.addEventListener("input", () => {
        const value = (light.value - light.min) / (light.max - light.min);
        light.style.background = `linear-gradient(to right, #0075ff 0%, #0075ff ${value * 100
            }%, #efefef ${value * 100}%, #efefef 100%)`;
    });

    //Set background depends on the thumb
    const initialRainValue = rain.value;
    const initialRainPosition =
        ((initialRainValue - rain.min) / (rain.max - rain.min)) * 100;
    rain.style.background = `linear-gradient(to right, #0075ff 0%, #0075ff ${initialRainPosition}%, #efefef ${initialRainPosition}%, #efefef 100%)`;
    rain.addEventListener("input", () => {
        const value = (rain.value - rain.min) / (rain.max - rain.min);
        rain.style.background = `linear-gradient(to right, #0075ff 0%, #0075ff ${value * 100
            }%, #efefef ${value * 100}%, #efefef 100%)`;
    });

    setInterval(async () => {
        let headLightValue = await vehicle["Body.Lights.IsHighBeamOn"].get();
        if (headLightValue) {
            left_light.style.visibility = 'visible';
            right_light.style.visibility = 'visible';
        } else {
            left_light.style.visibility = 'hidden';
            right_light.style.visibility = 'hidden';
        }
    }, 1000)

    let engineValue = false

    startBtn.onclick = function (e) {
        e.stopPropagation();
        engineValue = !engineValue;
    };

    simulator("Vehicle.Powertrain.ElectricMotor.Power", "get", () => {
        return engineValue;
    });

    simulator("Vehicle.Powertrain.ElectricMotor.Power", "set", (newValue) => {
        engineValue = newValue
    });

    setInterval(() => {
        if (engineValue) {
            // render button engine is ON
            activeBtn.classList.add('pill');
        } else {
            // render button engine is OFF
            activeBtn.classList.remove('pill');
        }
    }, 1000)

    simulator("Vehicle.Exterior.LightIntensity", "get", () => {
        return light.value;
    });
    simulator("Vehicle.Body.Raindetection.Intensity", "get", () => {
        return rain.value;
    });

    widgets.register("HeadLight", (box) => {
        box.injectNode(divHeadLight);
    });
    widgets.register("EngineButton", (box) => {
        box.injectNode(engineBtn);
    });
};
export default plugin;