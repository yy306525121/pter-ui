import { defineStore } from 'pinia';
import http from './http';
import { Response } from '@/types';
import { useMenuStore } from './menu';
import { useAuthStore } from '@/plugins';

export interface Profile {
  user: User;
  permissions: string[];
  roles: string[];
}
export interface User {
  username: string;
  avatar: string;
  gender: number;
}

export type TokenResult = {
  token: string;
  expires: number;
};
export const useAccountStore = defineStore('account', {
  state() {
    return {
      user: {} as User,
      permissions: [] as string[],
      roles: '',
      logged: true,
    };
  },
  actions: {
    async login(username: string, password: string) {
      return http
        .request<TokenResult, Response<TokenResult>>('/login', 'post_json', { username, password })
        .then(async (response) => {
          debugger
          if (response.code === 0) {
            this.logged = true;
            http.setAuthorization(`Bearer ${response.data.token}`, new Date(response.data.expires));
            await useMenuStore().getMenuList();
            return response.data;
          } else {
            return Promise.reject(response);
          }
        });
    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        localStorage.removeItem('stepin-menu');
        http.removeAuthorization();
        this.logged = false;
        resolve(true);
      });
    },
    async profile() {
      return http.request<User, Response<Profile>>('/info', 'get').then((response) => {
        if (response.code === 0) {
          const { setAuthorities } = useAuthStore();
          const { user, permissions, roles } = response.data;
          this.user = user;
          this.permissions = permissions;
          this.roles = roles;
          setAuthorities(permissions);
          return response.data;
        } else {
          return Promise.reject(response);
        }
      });
    },
    setLogged(logged: boolean) {
      this.logged = logged;
    },
  },
});
