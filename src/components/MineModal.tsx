import { useEffect, useState } from "react"
import { Modal } from "./Modal"
import "./MineModal.scss"
import { gameService } from "../services/gameService"
interface Category {
    name: string,
    duration: number,
    checked: boolean
}

export const MineModal = (props: { show: boolean, onClose: () => void }) => {
    const { show, onClose } = props
    const [cates, setCates] = useState<Array<Category>>([]);
    const [score, setScore] = useState(0);
    const [totalTime, setTotalTime] = useState(0)

    useEffect(() => {
        gameService.getkeys().then((keys: Category[]) => {
            setCates(keys)
            let tTime = 0;
            keys.forEach(({ duration, checked }) => {
                tTime += checked ? duration : 0
            })
            setTotalTime(tTime)
        })
    }, [cates])
    useEffect(() => {
        gameService.getScore().then(data => setScore(data))
    }, [])
    useEffect(() => {
        gameService.setChecked(cates)
    }, [cates])
    return (
        <Modal show={show} onClose={onClose}>
            <div className="mine-modal-wrapper">
                <img className="icon-mine" src={`${process.env.PUBLIC_URL}/mine.png`} alt="" />
                <div className="line">
                    积分：{score}
                </div>
                <div className="line">
                    学习时长：{totalTime} h
                </div>
                <div className="line">
                    积分分类：
                </div>
                <div className="categories">
                    {cates.map((item, index) => (
                        <div
                            className={`category ${item.checked ? "checked" : ""}`}
                            onClick={() => {
                                const newCates = [...cates]
                                newCates[index].checked = !newCates[index].checked
                                setCates(newCates)
                            }}
                            key={index}>
                            {item.name}
                        </div>))}
                </div>
            </div>
        </Modal>
    )
}