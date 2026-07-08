import type { PersonalAccessToken, ApiUsageLog } from "./domain"

export type LoginResponse = {
  'access-token': string;
  'message': string;
}

export type LogoutResponse = {
  'message': string;
}

export type ApiUsageLogWithtoken = {
  token: PersonalAccessToken,
  logs: ApiUsageLog[],
}

export type ApiUsage = {
  requestCount: number,
  averageResponseMs: number,
}

export type DashboardOverview = {
  apiUsage: ApiUsage,
  patCount: number,
}
