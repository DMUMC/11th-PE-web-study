export default function Pagination() {
  return (
    <div className="mt-11 flex items-center justify-center gap-[6px]">
      <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent p-0">
        <img
          className="h-4 w-4"
          src="/icons/chevron-left.svg"
          alt="이전"
        />
      </button>

      <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border-0 bg-[#111111] p-0 text-[13px] text-white">
        1
      </button>

      <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent p-0">
        <img
          className="h-4 w-4"
          src="/icons/chevron-right.svg"
          alt="다음"
        />
      </button>
    </div>
  );
}