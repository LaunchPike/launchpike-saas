import { useEffect, useState } from "react";
import Image from "./Image";
import "./QuickMenu.scss";

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "";

export default function QuickMenuComponent({ mode = "default" }) {

  const [open, setOpen] = useState(false)

  const switchOpen = () => {
    setOpen(!open)
  }

  useEffect(() => {
    if (window.innerWidth <= 768) {
      const dataSidebar = document.querySelector("#data-sidebar")
      dataSidebar.style.display = open ? "flex" : "none"
    }
  }, [open])

  switch (mode) {
    case "document":
      return (
        <div
          className="data-sidebar w-full flex flex-row justify-center sticky top-0 z-50"
        >
          <div className="lg:flex dock w-full">
            <div class="flex flex-row items-center py-2.5 px-4 w-full justify-between">
              <div className="flex flex-row gap-4 justify-between items-center">
                <a href="/">
                  <img className="hidden lg:flex" src={`${PUBLIC_BASE_URL}/logo.png`} alt="Launchpike" />
                  <img className="flex lg:hidden w-[40px]" src={`${PUBLIC_BASE_URL}/Logo.png`} alt="Launchpike" />
                </a>
                <a href="/docs">Docs</a>
                <a href="/#faq">FAQ</a>
                <a href="/blog">Blog</a>
              </div>
              <div className="flex flex-row gap-4 justify-between items-center">
                <div className="flex-1">
                  <ul className="hidden lg:flex gap-12 py-6">
                    <li>
                      <a href="">
                        <Image className="h-[20px] w-[20px]" src="telegram-grey-icon.png" alt="launchpike telegram" />
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <Image className="h-[20px] w-[20px]" src="github-icon.png" alt="launchpike github" />
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <Image className="h-[20px] w-[20px]" src="x-icon.png" alt="launchpike X" />
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <Image className="h-[20px] w-[20px]" src="discord-icon.png" alt="launchpike discord" />
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => switchOpen()}
                >
                  <Image className="w-12 h-8" src="Burger.png" />
                </button>
                <a
                  href=""
                  className="hidden lg:flex flex-row gap-2.5 py-2.5 px-5 rounded-[12px] text-white bg-[#5F9BFE] whitespace-nowrap"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div
          className="w-full flex flex-row justify-center sticky top-10 z-50"
        >
          <div className="hidden lg:flex liquidGlass-wrapper dock ">
            <div class="liquidGlass-effect"></div>
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
            <div class="liquidGlass-text flex flex-row items-center  gap-[200px] py-2.5 px-4 w-full">
              <div className="flex flex-row gap-4 justify-between items-center">
                <a href="/">
                  <img className="hidden lg:flex" src={`${PUBLIC_BASE_URL}/logo.png`} alt="Launchpike" />
                  <img className="flex lg:hidden w-[40px]" src={`${PUBLIC_BASE_URL}/Logo.png`} alt="Launchpike" />
                </a>
                <a href="/docs">Docs</a>
                <a href="/#faq">FAQ</a>
                <a href="/blog">Blog</a>
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
}
