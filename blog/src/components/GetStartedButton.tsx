export default ({ href, className }: { href: string, className?: string }) => <a
    href={href}
    className={"flex flex-row gap-2.5 py-2.5 px-5 rounded-[12px] text-white bg-[#5F9BFE] w-fit" + " " + className}
>
    <span>Get started</span>
</a>