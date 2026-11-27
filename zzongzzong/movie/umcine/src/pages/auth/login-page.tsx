import { useState } from "react";
import { apiClient } from "../../api/api-client";

export function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) && form.password.length > 0;
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await apiClient.post("auth/login", {
                json: { email: form.email.trim(), password: form.password },
            }).json<{ message: string }>();
            alert(response.message);
        } catch {
            alert("로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[430px]">
                <p className="text-[34px]">로그인</p>
                <div className="mt-[10px]">
                    <p className="text-[13px] font-bold">이메일</p>
                    <input
                        type="email" value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="name@example.com"
                        className="flex items-center placeholder:text-[14px] w-full h-[50px] border-1 border-[#E3E6EB] bg-white rounded-[8px] px-[13px] py-[14px]" />
                </div>

                <div className="mt-[30px]">
                    <p className="text-[13px] font-bold">비밀번호</p>
                    <input
                        type="password" value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="8자 이상"
                        className="flex items-center placeholder:text-[14px] w-full h-[50px] border-1 border-[#E3E6EB] bg-white rounded-[8px] px-[13px] py-[14px]" />
                </div>

                <div className="flex flex-col">
                    <form onSubmit={handleSubmit} noValidate
                        className="h-[48px] mt-[20px] flex items-center justify-center text-[#FFFFFF] font-bold bg-[#2563EB] rounded-[8px] cursor-pointer">
                        {/* UI 구현 */}
                        <button type="submit" disabled={!canSubmit || isSubmitting}
                            className="cursor-pointer">
                            {isSubmitting ? "로그인 중" : "로그인"}
                        </button>
                    </form>
                    <div className="mt-[20px] flex items-center justify-center gap-[6px]">
                        <p className="text-[13px] text-[#606774]">처음이신가요?</p>
                        <p className="text-[12px] text-[#2563EB] font-bold cursor-pointer">회원가입</p>
                    </div>
                </div>
            </div>
        </div>
    )
}