import HoverBoard from "../HoverBoard/HoverBoard.jsx";
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
    const animationDuration = 0.8; // seconds
    const reduce = useReducedMotion();
    return (
        <section className="relative w-full">
            <motion.h1
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={reduce ? { duration: 0 } : { duration: animationDuration, ease: "easeOut" }}
                className="absolute w-full text-center top-40 font-extrabold text-6xl z-20"
            >
                {title}
            </motion.h1>
            <div className="flex flex-row justify-start w-full items-center">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={reduce ? { duration: 0 } : { duration: animationDuration, ease: "easeOut", delay: animationDuration }}
                    className="flex-1 border-white border-r h-full flex flex-col items-center justify-center mt-20"
                >
                    <span className="font-light text-[400px] leading-96"
                    >{compare.launchpike.time}
                    </span>
                    <div>
                        <span className="font-extrabold text-6xl">in </span>
                        <span className="font-normal text-6xl">{compare.launchpike.span}</span>
                    </div>
                    <div className="w-[160px] h-[80px] bg-white flex flex-row mt-[50px]">
                        <div className="bg-[#3B82F6] w-[80px] border-r border-white"></div>
                        <div className="bg-[#3B82F6] w-[40px]"></div>
                        <div className="bg-white w-[40px]"></div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={reduce ? { duration: 0 } : { duration: animationDuration, ease: "easeOut", delay: animationDuration }}
                    className="flex-1 border-white border-l h-[1080px] flex flex-col items-center justify-center"
                >
                    <HoverBoard />
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="font-light text-[400px] leading-96"
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