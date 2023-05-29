import { useState } from "react"
import { Modal } from "./Modal"
import "./ShopModal.scss"
import { gameService } from "../services/gameService"
export const ShopModal = (props: { show: boolean, onClose: () => void }) => {
    const { show, onClose } = props
    const [eggImg, setEggImg] = useState("egg")
    const [chenggong, setChenggong] = useState(false)
    const [text, setText] = useState("fuhua")
    const [birdIndex, setBirdIndex] = useState(0)
    const onClickButton = () => {
        if (text === "fuhua") {
            setEggImg("fuhua2")
            setTimeout(() => {
                const bird = Math.floor(Math.random() * 16) + 1
                setEggImg("bird" + bird)
                setBirdIndex(bird);
                setChenggong(true)
                setText("lingqu")
            }, 2000)
        } else { // lingqu
            gameService.addbird(birdIndex)
            setEggImg("egg")
            setChenggong(false)
            setText("fuhua")
            onClose();
        }
    }
    return (
        <Modal show={show} onClose={onClose}>
            <div className="shop-modal-wrapper">
                <img className="icon-egg-button" src={`${process.env.PUBLIC_URL}/${text}.png`} alt="" onClick={onClickButton} />
                <img className="icon-egg-base" src={`${process.env.PUBLIC_URL}/eggBase.png`} alt="" />
                <img className="icon-egg" src={`${process.env.PUBLIC_URL}/${eggImg}.png`} alt="" />
                {chenggong ? <img className="icon-chenggong" src={`${process.env.PUBLIC_URL}/fuhuachenggong.png`} alt="" /> : null}
            </div>
        </Modal>
    )
}