import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { checkNickname } from "../../api/members/check-nickname";
import {
  FormField,
  InputBox,
  inlineButtonClass,
  inputClass,
} from "../../components/auth/form-field";
import { Icon } from "../../components/common/icon";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { StatusMessage } from "../../components/common/status-message";
import type { MemberInfo } from "../../api/members/me";
import { PROFILE_IMAGE_MAX_BYTES } from "../../config/profile";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { cn } from "../../utils/cn";
import { isValidNickname } from "../../utils/members/validate-member";

const DEFAULT_NICKNAME_CHECK = { isChecking: false, isAvailable: false };

interface MyEditFormProps {
  member: MemberInfo;
}

// 서버에서 받은 회원 정보로 입력값을 시작하려고 key를 준 폼 컴포넌트로 나눴다.
// 프로필 이미지는 서버 API가 없어 미리보기까지만 한다.
function MyEditForm({ member }: MyEditFormProps) {
  const updateMeMutation = useUpdateMeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(member.nickname);
  const [nicknameCheck, setNicknameCheck] = useState(DEFAULT_NICKNAME_CHECK);
  const [profileImage, setProfileImage] = useState<{ file: File; url: string } | null>(
    null,
  );
  const [imageError, setImageError] = useState<string | null>(null);

  // 미리보기 주소는 다른 이미지로 바꾸거나 화면을 떠날 때 해제한다.
  useEffect(() => {
    if (!profileImage) return;
    return () => URL.revokeObjectURL(profileImage.url);
  }, [profileImage]);

  const trimmedNickname = nickname.trim();
  const isNicknameChanged = trimmedNickname !== member.nickname;
  const isNicknameValid = isValidNickname(nickname);
  const nicknameError =
    !isNicknameValid ? "닉네임은 2자 이상 12자 이하로 입력해 주세요." : null;

  // 바꾼 닉네임은 중복 확인을 통과해야 저장할 수 있다.
  const canSave =
    isNicknameChanged &&
    isNicknameValid &&
    nicknameCheck.isAvailable &&
    !updateMeMutation.isPending;

  function handleChangeNickname(value: string) {
    if (nicknameCheck.isChecking) return;
    setNicknameCheck(DEFAULT_NICKNAME_CHECK);
    setNickname(value);
  }

  async function handleCheckNickname() {
    if (!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking) return;

    setNicknameCheck({ isChecking: true, isAvailable: false });
    try {
      const { available } = await checkNickname(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: available });
      alert(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setNicknameCheck(DEFAULT_NICKNAME_CHECK);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  }

  function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      setImageError("5MB 이하의 이미지만 올릴 수 있어요.");
      return;
    }

    setImageError(null);
    setProfileImage({ file, url: URL.createObjectURL(file) });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <form onSubmit={handleSubmit} noValidate className="flex min-h-[760px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">
              내 정보 수정
            </h1>
            <p className="mt-1 text-sm text-ink-sub">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="mt-2 h-10 shrink-0 rounded-md bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row">
          <div className="flex flex-col items-center lg:w-[280px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative"
              aria-label="프로필 이미지 선택"
            >
              <ProfileAvatar imageUrl={profileImage?.url} className="size-24" />
              <span className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-ink text-white">
                <Icon name="edit" className="size-4" />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeImage}
            />
            <p className="mt-3 text-sm font-bold">프로필 이미지</p>
            <p className="mt-1 text-xs text-ink-muted">
              {profileImage ? profileImage.file.name : "선택 사항 · 최대 5MB"}
            </p>
            {imageError && (
              <p role="alert" className="mt-1 text-xs text-danger">
                {imageError}
              </p>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:max-w-[560px] lg:ml-auto">
            <FormField id="edit-nickname" label="닉네임" error={nicknameError}>
              <InputBox invalid={Boolean(nicknameError)}>
                <input
                  id="edit-nickname"
                  type="text"
                  value={nickname}
                  disabled={nicknameCheck.isChecking}
                  onChange={(event) => handleChangeNickname(event.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  disabled={
                    !isNicknameChanged ||
                    !isNicknameValid ||
                    nicknameCheck.isChecking ||
                    nicknameCheck.isAvailable
                  }
                  onClick={handleCheckNickname}
                  className={cn(
                    inlineButtonClass,
                    nicknameCheck.isAvailable && "disabled:text-primary",
                  )}
                >
                  {nicknameCheck.isChecking
                    ? "확인 중"
                    : nicknameCheck.isAvailable
                      ? "확인 완료"
                      : "중복 확인"}
                </button>
              </InputBox>
            </FormField>

            <FormField id="edit-email" label="이메일" hint="이메일은 변경할 수 없어요.">
              <InputBox disabled>
                <input
                  id="edit-email"
                  type="email"
                  value={member.email}
                  disabled
                  className={inputClass}
                />
              </InputBox>
            </FormField>
          </div>
        </div>

        <section className="mt-auto flex items-center justify-between gap-4 rounded-lg border border-danger/40 bg-red-50 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-danger">회원 탈퇴</h2>
            <p className="mt-1 text-xs text-danger/80">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button
            type="button"
            className="h-9 shrink-0 rounded-md border border-danger bg-white px-3 text-xs font-bold text-danger"
          >
            회원 탈퇴
          </button>
        </section>
      </form>
    </main>
  );
}

export function MyEditPage() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage>내 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage tone="error">내 정보를 불러오지 못했어요.</StatusMessage>
      </main>
    );
  }

  return <MyEditForm key={`form-${meQuery.data.memberId}`} member={meQuery.data} />;
}
