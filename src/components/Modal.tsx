import "./Modal.scss"
interface ModalProps {
    show: boolean,
    children?: React.ReactElement
    onClose?: () => void
}

export const Modal = (props: ModalProps) => {
    const { show, children, onClose } = props
    return (
        show ? (<div className="modal-wrapper">
            <div className="modal-mask" />
            <div className="modal-content">
                <div className="modal-inner">
                    {children}
                </div>
                <img className="icon-close" src={`${process.env.PUBLIC_URL}/close.png`} alt="" onClick={onClose} />
            </div>
        </div>) : null
    )
}