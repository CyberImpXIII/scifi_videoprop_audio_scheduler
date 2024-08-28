const clipEndHandler = (id,audioButtonHandler, clipMode='Sequential' )=>{
    //this should be handling the majority of the logic.  Consider expanding this out to its own file
    switch(clipMode){
      case 'Sequential':
        document.getElementById(`audioPlayer${id + 1}`).play();
        break;
      case 'DelayedSequential':
        setTimeout(()=>{
          document.getElementById(`audioPlayer${id + 1}`).play();
        }, 1000)
        break;
      default:
        audioButtonHandler(id);
    }
  }

export default clipEndHandler