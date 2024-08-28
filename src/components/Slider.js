const Slider = ({sliderVal, sliderHandle})=>{
    <div class="slidecontainer">
    <input type="range" min="1" max="100" value={sliderVal} className="slider" id="myRange" onChange={sliderHandle}/>
  </div>
}

export default Slider