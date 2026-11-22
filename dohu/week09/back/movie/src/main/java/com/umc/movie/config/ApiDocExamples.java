package com.umc.movie.config;

// Swagger 실패 응답 예시를 컨트롤러마다 반복해 적지 않으려고 모아 둔다.
// 애노테이션 값으로 쓰려면 컴파일 시점 상수여야 해서 static final 문자열로 둔다.
public final class ApiDocExamples {

    private ApiDocExamples() {
    }

    public static final String AUTH401_1 = """
            {"isSuccess": false, "code": "AUTH401_1", "message": "이메일 또는 비밀번호가 올바르지 않습니다.", "result": null}""";

    public static final String AUTH401_2 = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "로그인이 필요한 요청입니다.", "result": null}""";

    public static final String COMMON4001 = """
            {"isSuccess": false, "code": "COMMON4001", "message": "영화 ID는 양수여야 합니다.", "result": null}""";

    public static final String MEMBER404_1 = """
            {"isSuccess": false, "code": "MEMBER404_1", "message": "해당 회원을 찾을 수 없습니다.", "result": null}""";

    public static final String MEMBER409_1 = """
            {"isSuccess": false, "code": "MEMBER409_1", "message": "이미 사용 중인 닉네임입니다.", "result": null}""";

    public static final String DUPLICATE_MEMBER = """
            {"isSuccess": false, "code": "COMMON4092", "message": "이미 사용 중인 이메일입니다.", "result": null}""";

    public static final String RATING403_1 = """
            {"isSuccess": false, "code": "RATING403_1", "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.", "result": null}""";

    public static final String RATING404_1 = """
            {"isSuccess": false, "code": "RATING404_1", "message": "해당 평점을 찾을 수 없습니다.", "result": null}""";

    public static final String RATING409_1 = """
            {"isSuccess": false, "code": "RATING409_1", "message": "이미 이 영화에 평점을 남기셨습니다.", "result": null}""";

    public static final String FAVORITE404_1 = """
            {"isSuccess": false, "code": "FAVORITE404_1", "message": "즐겨찾기한 영화를 찾을 수 없습니다.", "result": null}""";

    public static final String FAVORITE409_1 = """
            {"isSuccess": false, "code": "FAVORITE409_1", "message": "이미 이 영화를 즐겨찾기하셨습니다.", "result": null}""";
}
