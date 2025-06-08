export enum SupportRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

export const SUPPORT_REQUEST_LIMITS = {
  SUBJECT_MIN: 5,
  SUBJECT_MAX: 100,
  MESSAGE_MIN: 20,
  MESSAGE_MAX: 1000,
} as const;
