import { BoxInt } from "./Interface"

export default function Box(props: BoxInt) {
    return (
        <div className={props.isHeld ? "box isHeld" : "box"} onClick={() => props.selectDice(props.id)}>
            <h1>{props.randomNumber}</h1>
        </div>
    )
}