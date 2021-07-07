import React from "react";
import { useClickPreventionOnDoubleClick } from "./stop-triggering-onclick-twice-ondoubleclick";

const ClickableBox = ({ onClick, onDoubleClick }) => {
  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onClick, onDoubleClick);

  return (
    <div onClick={handleClick} onDoubleClick={handleDoubleClick}>
      Click or double click
    </div>
  );
};


const DoubleClickExample = () => (
  <ClickableBox onClick={() => console.log("on click")} onDoubleClick={() => console.log("on double click")}/>
);

export default DoubleClickExample;