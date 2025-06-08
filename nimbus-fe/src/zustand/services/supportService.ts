import { apiHelper } from "@/zustand/utils/api.utils";
import { API_CONFIG } from "@/config/api";
import { SupportRequest } from "@/app/support/my-requests/columns";

export const supportService = {
  getRequests: async () => {
    return apiHelper.get<{ data: SupportRequest[] }>(
      API_CONFIG.endpoints.support.requests,
    );
  },

  createRequest: async (data: { subject: string; message: string }) => {
    return apiHelper.post<{ data: SupportRequest }>(
      API_CONFIG.endpoints.support.request,
      data,
    );
  },
};
