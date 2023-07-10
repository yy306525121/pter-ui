export interface LoginForm {
  username: string;
  password: string;
}

export interface Response<T = never> {
  msg: string;
  code: number;
  data: T;
}

export function isResponse(obj: any): obj is Response<any> {
  debugger
  return typeof obj === 'object' && obj.msg === 'success' && obj.code !== 1;
}
