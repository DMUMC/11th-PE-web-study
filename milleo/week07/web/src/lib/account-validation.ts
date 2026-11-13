export function emailError(value: string): string {
  if (!value.trim()) return '이메일을 입력해 주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return '이메일 형식을 확인해 주세요.';
  return '';
}

export function nicknameError(value: string): string {
  const length = value.trim().length;
  return length < 2 || length > 12 ? '닉네임은 2~12자로 입력해 주세요.' : '';
}
