import { useEffect, useState } from "react"
import { Modal } from "./Modal"
import "./ConfigModal.scss"
import { THEME, gameService } from "../services/gameService"
export const ConfigModal = (props: { show: boolean, onClose: () => void }) => {
    const { show, onClose } = props
    const [chose, setChose] = useState(3)
    useEffect(() => {
        gameService.getBackGround().then((value: number) => setChose(value))
    }, [])

    function onConfirm() {
        gameService.setBackGround(chose)
        onClose()
    }

    return (
        <Modal show={show} onClose={onClose}>
            <div className="config-modal-wrapper">
                <img className="icon-config" src={`${process.env.PUBLIC_URL}/configt.png`} alt="" />
                <img className="img-choice" src={`${process.env.PUBLIC_URL}/ch${THEME[chose]}.png`} alt="" onClick={() => setChose((chose + 1) % THEME.length)} />
                <img className="icon-ok" src={`${process.env.PUBLIC_URL}/ok.png`} alt="" onClick={onConfirm} />
            </div>
        </Modal>
    )
}