import React, { useRef } from 'react'

export const DoubleClickP = (props) => {
  const MAX_TIME_TO_SECOND_TAP = 300;
  const lastTapTimestamp = useRef(0);
  const touchListener = function(event) {
    var currentTime = new Date().getTime();
    var tapElapsedTime = currentTime - lastTapTimestamp.current;
    if (tapElapsedTime < MAX_TIME_TO_SECOND_TAP && tapElapsedTime > 0) {
      props.onDoubleClick(event); 
      lastTapTimestamp.current = 0; 
    } else {
      lastTapTimestamp.current = new Date().getTime();
    }
  };

  return <p onTouchEnd={touchListener} {...props}/>
}