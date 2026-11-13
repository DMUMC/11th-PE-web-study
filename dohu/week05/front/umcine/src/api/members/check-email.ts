import { apiClient } from "../api-client";
import type { AvailabilityResponse } from "./models";

type CheckEmailResponse = AvailabilityResponse;

function checkEmail(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailResponse>();
}

export { checkEmail, type CheckEmailResponse };
