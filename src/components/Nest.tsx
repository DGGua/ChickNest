import { useEffect, useState } from "react"
import "./Nest.scss"
import { randomBytes } from "crypto";

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))


interface NestProps {
    birds: number[]
}
interface PointProps {
    x?: number,
    y?: number,
    i?: number
}
interface Point {
    x: number,
    y: number
}
type BirdProps = {
    birdIndex?: number,
    birdDirection?: boolean
} & Point;

const Point = ({ x = 0, y = 0, i }: PointProps) => {
    return <div style={{ position: "absolute", width: "10px", height: "10px", background: "black", left: `${x}%`, top: `${y}%`, color: "white" }}>{i}</div>
}

const ps: Array<Omit<Point, "i">> = [
    { x: 10, y: 50 },
    { x: 15, y: 30 },
    { x: 30, y: 20 },
    { x: 70, y: 18 },
    { x: 90, y: 30 },
    { x: 95, y: 50 },
    { x: 85, y: 70 },
    { x: 50, y: 90 },
    { x: 30, y: 90 },
    { x: 10, y: 50 },
]
function calcIn(x: number, y: number) {
    let ok = true;
    ps.forEach(({ x: px, y: py }, index, arr) => {
        if (!ok || index == 0) { return }
        const { x: ppx, y: ppy } = arr[index - 1]
        const v1x = x - ppx
        const v1y = y - ppy
        const v2x = px - ppx
        const v2y = py - ppy
        ok = ok && ((v1x * v2y) - (v2x * v1y) < 0)
    })
    return ok
}
const threshold = 5
function genPosition() {
    let x = Math.random() * 100;
    let y = Math.random() * 100;
    let count = 0;
    while (!calcIn(x, y)) {
        if (count > threshold) {
            x = 50;
            y = 50;
            break;
        }
        x = Math.random() * 100;
        y = Math.random() * 100;
        count++;
    }
    return { x, y }
}
function genRandomNum(left: number, range: number) {
    return Math.random() * range + left
}
function genNewPos(cur: Point): Point {
    return { x: cur.x + genRandomNum(-20, 40), y: cur.y + genRandomNum(-20, 40) }
}
const Bird = ({ x, y, birdIndex: index = 1, birdDirection = false }: BirdProps) => {
    const [pos, setPos] = useState<Point>({ x, y })
    const [direction, setDirection] = useState(birdDirection)
    const updatePos = async (pos: Point, newPos: Point, direction: boolean) => {
        const needTrans = (newPos.x > pos.x && direction) || (newPos.x < pos.x && !direction)
        if (needTrans) {
            setDirection(!direction)
            await sleep(2000)
        }
        setPos(newPos)
        return needTrans ? !direction : direction
    }
    const genPos = async (pos: Point, direction: boolean) => {
        const newPos = genNewPos(pos);
        if (calcIn(newPos.x, newPos.y)) {
            const newDirection = await updatePos(pos, newPos, direction)
            await sleep(4000)
            setTimeout(() => genPos(newPos, newDirection), genRandomNum(1000, 10000))
        } else {
            setTimeout(() => genPos(pos, direction), genRandomNum(1000, 10000))
        }
    }

    useEffect(() => {
        let timeout = setTimeout(() => genPos(pos, direction), genRandomNum(1000, 10000))
        return () => { clearTimeout(timeout) }
    }, []);

    return <div className="bird-wrapper" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `rotateY(${direction ? 0 : 180}deg)`, zIndex: Math.ceil(pos.y) }}>
        <div className="bird" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bird${index}.png)` }}></div>
    </div>
}

export const Nest = (props: NestProps) => {
    const { birds } = props
    return (
        <div className="nest-frame">
            {birds.map((bird, index) =>
                <Bird {...genPosition()} birdIndex={bird} birdDirection={Math.random() < 0.5} key={index} />
            )}
        </div >
    )
}
