import { useEffect, useState } from "react"
import { Modal } from "./Modal"
import "./GalModal.scss"
import { gameService } from "../services/gameService"
const GalItem = (props: { index: number, show: boolean }) => {
    const { index, show } = props
    if (show) {
        return <div className="icon-base">
            <img className="icon-inner-back" src={`${process.env.PUBLIC_URL}/galleryBase.png`} alt="" />
            <img className="icon-bird" src={`${process.env.PUBLIC_URL}/bird${index + 1}.png`} alt="" />
        </div>
    } else {
        return <div className="icon-base">
            <img className="icon-inner-back" src={`${process.env.PUBLIC_URL}/galleryUnknown.png`} alt="" />
        </div>
    }
}

export const GalModal = (props: { show: boolean, onClose: () => void }) => {
    const { show, onClose } = props
    const [page, setPage] = useState(0)
    const [collected, setCollected] = useState<boolean[]>(Array(16).fill(false))
    const handleLeft = () => {
        if (page == 0) return
        setPage(page - 1)
    }
    const handleRight = () => {
        if (page == 3) return
        setPage(page + 1)
    }
    useEffect(() => {
        setPage(0)
        gameService.getbirds().then((birds: number[]) => {
            const arr = Array(16).fill(false)
            birds.forEach(val => arr[val - 1] = true)
            setCollected(arr)
        })
    }, [show])
    return (
        <Modal show={show} onClose={onClose}>
            <div className="gal-modal-wrapper">
                <img className="icon-tujian" src={`${process.env.PUBLIC_URL}/gal.png`} alt="" />
                <div className="gallery">
                    <div className="gallery-line ">
                        <GalItem index={page * 4} show={collected[page * 4]} />
                        <GalItem index={page * 4 + 1} show={collected[page * 4 + 1]} />
                    </div>
                    <div className="gallery-line ">
                        <GalItem index={page * 4 + 2} show={collected[page * 4 + 2]} />
                        <GalItem index={page * 4 + 3} show={collected[page * 4 + 3]} />
                    </div>
                </div>
                <div className="arrow-line ">
                    <img className="icon-arrow" src={`${process.env.PUBLIC_URL}/left.png`} alt="" onClick={handleLeft} />
                    {page + 1} / 4
                    <img className="icon-arrow" src={`${process.env.PUBLIC_URL}/right.png`} alt="" onClick={handleRight} />
                </div>
            </div>
        </Modal>
    )
}