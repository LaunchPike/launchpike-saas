import { motion, useReducedMotion } from "framer-motion";
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || '';


export default function QuickMenuComponent() {

  const reduce = useReducedMotion();
  const animationDuration = 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: animationDuration, ease: "easeOut" }
      }
      className="w-full flex flex-row justify-center sticky top-10 z-50"
    >
      <div className="flex flex-row items-center bg-white rounded-2xl gap-[200px] py-2.5 px-4 w-fit">
        <div className="flex flex-row gap-4 justify-between items-center">
          <img src={`${PUBLIC_BASE_URL ?? ''}/logo.png`} alt="Launchpike" />
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="#blog">Blog</a>
        </div>
        <div className="flex flex-row gap-4 justify-between items-center">
          <a
            href=""
            className="flex flex-row gap-2.5 py-2.5 px-5 border border-[#3B82F6] rounded-[12px] text-[#3B82F6]"
          >
            <img src={`${PUBLIC_BASE_URL ?? ''}/github.svg`} alt="" />
            <span>120</span>
          </a>
          <a
            href=""
            className="flex flex-row gap-2.5 py-2.5 px-5 border border-[#3B82F6] rounded-[12px] text-[#3B82F6]"
          >
            <img src={`${PUBLIC_BASE_URL ?? ''}/telegram-logo.svg`} alt="" />
          </a>
          <a
            href=""
            className="flex flex-row gap-2.5 py-2.5 px-5 rounded-[12px] text-white bg-[#5F9BFE]"
          >
            <span>Get started</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
