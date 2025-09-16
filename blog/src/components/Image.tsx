import setImage from "../utils/setImage";

export default ({
    src,
    alt,
    className,
}: { src: string, alt: string, className?: string }) =>
    <img src={setImage(src)} alt={alt} className={className} />
