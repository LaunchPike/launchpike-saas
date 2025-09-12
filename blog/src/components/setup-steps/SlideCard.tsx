interface SlideCardProps {
    slideNumber: number;
    isActive: boolean;
    paddingFromLeft?: string;
}

export default function SlideCard({ slideNumber, isActive, paddingFromLeft }: SlideCardProps) {
    return (
        <div className="slide">
            <div className="relative" style={{ paddingLeft: paddingFromLeft ?? 0 }}>
                <img src={`/setup/slide${slideNumber}.png`} alt='' />
                <div className="absolute bottom-[-33px] right-[600px] w-[18px] h-[20px] bg-[#3B82F6] z-50"></div>
            </div>
        </div>
    );
}