import GetStartedButton from "./GetStartedButton";
import Image from "./Image";

const Footer = () => {
    return (
        <footer className="lg:h-[400px] w-full flex flex-col lg:flex-row gap-6 lg:gap-4 items-start justify-center px-5 py-15 lg:px-40 lg:py-30">
            <div className="flex-1">
                <div className="w-full">
                    <a href="/">
                        <Image src={`logo.png`} alt="" />
                    </a>
                </div>
                <ul className="flex gap-12 py-6">
                    <li>
                        <a href="">
                            <Image className="h-[20px]" src="telegram-grey-icon.png" alt="launchpike telegram" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <Image className="h-[20px]" src="github-icon.png" alt="launchpike github" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <Image className="h-[20px]" src="x-icon.png" alt="launchpike X" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <Image className="h-[20px]" src="discord-icon.png" alt="launchpike discord" />
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex lg:flex-1 justify-center">
                <ul className="flex flex-col gap-3 w-fit">
                    <h3 className="font-bold">Company</h3>
                    <li>
                        <a href="/docs">
                            Docs
                        </a>
                    </li>
                    <li>
                        <a href="#faq">
                            FAQ
                        </a>
                    </li>
                    <li>
                        <a href="/blog">
                            Blog
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex lg:flex-1 justify-center">
                <ul className="flex flex-col gap-3 w-fit">
                    <h3 className="font-bold">Resources</h3>
                    <li>
                        <a target="_blank" href="">
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="">
                            Terms of Service
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="">
                            Licenses
                        </a>
                    </li>
                </ul>
            </div>
            <ul className="flex lg:flex-1 justify-end">
                <li>
                    <GetStartedButton href={""} key={"get-started-footer"} />
                </li>
            </ul>
        </footer>
    )

}

export default Footer;