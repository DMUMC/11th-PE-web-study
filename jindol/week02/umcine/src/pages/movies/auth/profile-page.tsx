import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./auth-pages.css";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

export function ProfilePage() {
  const [nickname, setNickname] = useState("gs0428");
  const [profileImage, setProfileImage] = useState<string>();
  const [imageError, setImageError] = useState("");

  useEffect(
    () => () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    },
    [profileImage],
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 선택할 수 있어요.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setImageError("프로필 이미지는 5MB 이하만 사용할 수 있어요.");
      event.target.value = "";
      return;
    }

    setImageError("");
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="profile-page">
      <div className="profile-content">
        <div className="profile-heading">
          <div>
            <h1>내 정보 수정</h1>
            <p>닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button className="auth-primary-button profile-save-button" type="submit" form="profile-form">
            변경사항 저장
          </button>
        </div>

        <form id="profile-form" className="profile-form" onSubmit={handleSubmit}>
          <section className="profile-avatar-section" aria-label="프로필 이미지">
            <label className="profile-avatar-picker" htmlFor="profile-image">
              <span className="profile-avatar">
                {profileImage ? (
                  <img src={profileImage} alt="선택한 프로필 이미지" />
                ) : (
                  <img src="/movie-icons/person.svg" alt="" />
                )}
              </span>
              <span className="profile-avatar-title">프로필 이미지</span>
              <span className="profile-avatar-hint">선택 사항 · 최대 5MB</span>
              <span className="profile-edit-icon" aria-hidden="true">
                ✎
              </span>
            </label>
            <input
              id="profile-image"
              className="visually-hidden"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageError && <p className="auth-error">{imageError}</p>}
          </section>

          <div className="profile-fields">
            <div className="auth-form-group">
              <label htmlFor="profile-nickname">닉네임</label>
              <div className="auth-field">
                <input
                  id="profile-nickname"
                  type="text"
                  autoComplete="nickname"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                />
                <button className="auth-text-button" type="button">
                  중복 확인
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="profile-email">이메일</label>
              <div className="auth-field">
                <input
                  id="profile-email"
                  type="email"
                  value="gwangsoo@cinemalab.kr"
                  readOnly
                />
              </div>
            </div>
          </div>
        </form>

        <section className="profile-danger-zone">
          <div>
            <h2>회원 탈퇴</h2>
            <p>
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button className="profile-delete-button" type="button">
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}
