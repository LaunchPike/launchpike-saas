export default function Comment({ name, title, comment }) {
  return (
    <div className="comment-card p-4 border border-[#ECECEC] bg-[#F9FAFB] shadow-sm shadow-gray-300 rounded-xl flex flex-col gap-10">
      <div className="flex flex-row justify-start gap-3">
        <div className="relative">
          <img 
          width={40}
          height={40}
          src="/avatar.png" alt="" />
          <img
            className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full"
            src="/telegram-icon.png"
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[14px]">{name}</span>
          <span className="text-[#737373]">{title}</span>
        </div>
      </div>
      <p className="italic text-[14px]">{comment}</p>
    </div>
  );
}
