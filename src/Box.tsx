import { BoxInt } from "./Interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Box(props: BoxInt) {
  return (
      <FontAwesomeIcon
        onClick={() => props.selectDice(props.id)}
        icon={props.image}
        className={props.isHeld ? "dice isHeld" : "dice"}
      />
  );
}
