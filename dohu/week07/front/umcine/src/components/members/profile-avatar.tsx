import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

interface ProfileAvatarProps {
  imageUrl?: string | null;
  className?: string;
}

// 프로필 이미지가 없으면 사람 아이콘을 보여 준다.
export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
  return (
    <span
      className={cn(
        "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-ink",
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="프로필 이미지 미리보기" className="size-full object-cover" />
      ) : (
        <Icon name="person" className="size-8" />
      )}
    </span>
  );
}
