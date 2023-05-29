import { useEffect, useState } from "react"
import { Nest } from "../components/Nest"
import "./Main.scss"
import { ShopModal } from "../components/ShopModal"
import { MineModal } from "../components/MineModal"
import { GalModal } from "../components/GalModal"
import { ConfigModal } from "../components/ConfigModal"
import { THEME, gameService } from "../services/gameService"
export const MainPage = () => {
    const [showShopModal, setShowShopModal] = useState(false);
    const [showMineModal, setShowMineModal] = useState(false);
    const [showGalModal, setShowGalModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [birds, setBirds] = useState<number[]>([]);
    useEffect(() => {
        gameService.getBackGround().then((value: number) => { setBackgroundIndex(value) })
    }, [showConfigModal])
    useEffect(() => {
        gameService.getbirds().then((birds: number[]) => setBirds(birds))
    }, [showShopModal])
    return <div className="background">
        <div className="main-frame">
            <div className="nest" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/nest${THEME[backgroundIndex]}.png)` }}>
                <Nest birds={birds} />
            </div>
            <div className="ui">
                <div className="header" >
                    <div className="button-player" onClick={() => { setShowMineModal(true) }}>
                        <img className="icon-img" src={`${process.env.PUBLIC_URL}/mine.png`} alt="" />
                    </div>
                    <div className="button-shop" onClick={() => setShowShopModal(true)}>
                        <img className="icon-img" src={`${process.env.PUBLIC_URL}/shop.png`} alt="" />
                    </div>
                </div>
                <div className="body">
                    <div className="aside">
                        <div onClick={() => { setShowGalModal(true) }}>
                            <img className="icon-img" src={`${process.env.PUBLIC_URL}/gallery.png`} alt="" />
                        </div>
                        <div onClick={() => { setShowConfigModal(true) }}>
                            <img className="icon-img" src={`${process.env.PUBLIC_URL}/config.png`} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ShopModal show={showShopModal} onClose={() => setShowShopModal(false)} />
        <MineModal show={showMineModal} onClose={() => setShowMineModal(false)} />
        <GalModal show={showGalModal} onClose={() => setShowGalModal(false)} />
        <ConfigModal show={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </div >
}
