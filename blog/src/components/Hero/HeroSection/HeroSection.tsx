import HoverBoard from "../HoverBoard/HoverBoard.jsx";
import "./HeroSection.css"
import { motion, useReducedMotion } from "framer-motion";

interface HeroSectionProps {
    title: string;
    compare: {
        launchpike: {
            time: string;
            span: string;
        };
        others: {
            time: string;
            span: string;
        };
    };
}

export default function HeroSection({ title, compare }: HeroSectionProps) {
    const animationDuration = 0.1; // seconds
    const reduce = useReducedMotion();
    return (
        <section className="relative w-full flex flex-col items-start mt-[-6rem]" id="top-container">
            <motion.h1
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={reduce ? { duration: 0 } : { duration: animationDuration, ease: "easeOut" }}
                className="absolute w-fit text-center top-30 left-[50%] translate-x-[-50%] lg:top-65 font-extrabold z-20 relative text-4xl lg:text-6xl"
            >
                {title}
            </motion.h1>
            <div className="flex flex-col md:flex-row justify-start w-full items-center">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={reduce ? { duration: 0 } : { duration: animationDuration, ease: "easeOut", delay: animationDuration }}
                    className="flex-1 border-white border-r h-fit lg:h-full flex flex-col items-center justify-center mt-35 lg:mt-20"
                >
                    <span
                        className="font-light text-[140px] lg:text-[400px] block h-min leading-30 lg:leading-96"
                    >
                        {compare.launchpike.time}
                    </span>
                    <div>
                        <span className="font-extrabold text-6xl">in </span>
                        <span className="font-normal text-6xl">{compare.launchpike.span}</span>
                    </div>
                    <div className="loader-bars">
                        <div className="seg seg1"></div>
                        <div className="seg seg2"></div>
                        <div className="seg seg3"></div>
                    </div>

                </motion.div>
                <motion.div
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={reduce ? { duration: 0 } : { duration: animationDuration, ease: "easeOut", delay: animationDuration }}
                    className="flex-1 border-white border-l h-[1080px] flex flex-col items-center justify-center mt-10 lg:mt-0"
                >
                    <HoverBoard />
                    <div className="absolute flex flex-col items-center justify-center select-none pointer-events-none">
                        <span className="font-light text-[190px] lg:text-[400px] leading-40 lg:leading-96"
                        >{compare.others.time}</span>
                        <div>
                            <span className="font-extrabold text-6xl">not </span>
                            <span className="font-normal text-6xl">{compare.others.span}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

    )
}