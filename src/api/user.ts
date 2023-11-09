import { http } from "@/utils/http";

export type UserResult = {
  /** 用户名 */
  username: string;
  /** 当前登陆用户的角色 */
  roles: Array<string>;
  /** `token` */
  token: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expire: number;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: number;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>(
    "post",
    "/api/v1/login/access-token",
    { data },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};
