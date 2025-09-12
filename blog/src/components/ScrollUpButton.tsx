import Button from "./Button"
import { useEffect, useState } from "react"

function ScrollUpButton() {
    const [isVisible, setIsVisible] = useState(false)

    const handleScrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled up 300px
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    return (
        <>
            {isVisible && (
                <Button
                    id="scroll-up-btn"
                    onClick={handleScrollUp}
                    style={{
                        position: "fixed",
                        right: "20px",
                        bottom: "20px",
                        zIndex: 1000,
                    }}
                >
                    GO UP
                </Button>
            )}
        </>
    )
}

export default ScrollUpButton
