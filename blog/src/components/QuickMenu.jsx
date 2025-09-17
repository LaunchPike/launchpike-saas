import { motion, useReducedMotion } from "framer-motion";
import "./QuickMenu.scss";

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "";

export default function QuickMenuComponent() {
  const reduce = useReducedMotion();
  const animationDuration = 0.8;

  return (
    <div
      className="w-full flex flex-row justify-center sticky top-10 z-50"
    >
      <div className="hidden lg:flex rounded-2xl liquidGlass-wrapper dock ">
        <div class="liquidGlass-effect"></div>
        <div class="liquidGlass-tint"></div>
        <div class="liquidGlass-shine"></div>
        <div class="liquidGlass-text flex flex-row items-center  gap-[200px] py-2.5 px-4 w-fit">
          <div className="flex flex-row gap-4 justify-between items-center">
            <img src={`${PUBLIC_BASE_URL}/logo.png`} alt="Launchpike" />
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <a href="#blog">Blog</a>
          </div>
          <div className="flex flex-row gap-4 justify-between items-center">
            <a
              href=""
              className="flex flex-row gap-2.5 py-2.5 px-5 border border-[#3B82F6] rounded-[12px] text-[#3B82F6]"
            >
              <img src={`${PUBLIC_BASE_URL}/github.svg`} alt="GitHub" />
              <span>120</span>
            </a>
            <a
              href="https://t.me/launchpike_chat"
              className="flex flex-row gap-2.5 py-2.5 px-5 border border-[#3B82F6] rounded-[12px] text-[#3B82F6]"
            >
              <img src={`${PUBLIC_BASE_URL}/telegram-logo.svg`} alt="Telegram" />
            </a>
            <a
              href=""
              className="flex flex-row gap-2.5 py-2.5 px-5 rounded-[12px] text-white bg-[#5F9BFE]"
            >
              <span>Get started</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-row lg:hidden items-center liquid-glass liquid-glass--intense rounded-[16px] text-[20px] gap-[150px] py-2.5 px-4 w-fit mx-5">
        <div className="quick-menu-logo flex flex-row gap-4 justify-between items-center w-[40px] h-[40px]">
          <img src={`${PUBLIC_BASE_URL}/Logo.png`} alt="Logo" />
        </div>
        <div className="flex flex-row gap-4 justify-between items-center whitespace-nowrap">
          <a href="#" className="glass-button flex flex-row gap-2.5 py-2.5 px-5 rounded-[12px] text-white">
            <span>Get started</span>
          </a>
        </div>
      </div>
    </div>
  );
}
