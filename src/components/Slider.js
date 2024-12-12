const Slider = ({sliderVal, setSliderVal})=>{
    <div class="slidecontainer">
    <input type="range" min="1" max="100" value={sliderVal} className="slider" id="myRange" onChange={(e)=>{
      console.log(e.target.value)
      setSliderVal(e.target.value)}}/>
  </div>
}

export default Slider