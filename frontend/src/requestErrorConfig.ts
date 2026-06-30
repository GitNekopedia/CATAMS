import type { RequestConfig, RequestOptions } from '@umijs/max';
import { message } from 'antd';

interface ApiResponse<T = any> {
  code: string;
  message: string;
  data: T;
  error?: string;
  timestamp?: string;
}

// ====== Auth redirect guard ======
const AUTH_REDIRECTING_KEY = '__AUTH_REDIRECTING__';

function isLoginPage(pathname: string) {
  return pathname === '/mood/login' || pathname === '/user/login';
}

function redirectToLogin() {
  const pathname = window.location.pathname;

  // 登录页不跳
  if (isLoginPage(pathname)) return;

  // 跳转锁：避免并发请求/重复进入
  if (sessionStorage.getItem(AUTH_REDIRECTING_KEY) === '1') return;
  sessionStorage.setItem(AUTH_REDIRECTING_KEY, '1');

  message.warning('登录已过期或未登录，请重新登录');
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // mood 模块走 /mood/login，其它走 /user/login?redirect=
  if (pathname.startsWith('/mood')) {
    window.location.replace('/mood/login');
  } else {
    const redirect = encodeURIComponent(pathname);
    window.location.replace(`/user/login?redirect=${redirect}`);
  }
}

export const errorConfig: RequestConfig = {
  errorConfig: {
    // 交给 transformResponse
    errorThrower: (res) => res,

    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      // transformResponse 抛出的业务异常
      if (error?.__IS_BUSINESS_ERROR__) {
        // token 失效：统一在这里跳转（避免 transformResponse 跳转造成循环）
        if (error?.code === 'USR-001' || error?.message === 'UNAUTHORIZED') {
          redirectToLogin();
          return;
        }
        // 其他业务异常一般已在 transformResponse toast
        return;
      }

      // HTTP / 网络 / 其它错误
      if (error?.response) {
        message.error(`HTTP错误：${error.response.status}`);
      } else if (error?.request) {
        message.error('请求超时或无响应，请重试');
      } else {
        message.error(error?.message || '请求配置错误');
      }
    },
  },

  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],

  transformResponse: [
    (response: any) => {
      // 非 JSON 字符串直接返回（下载/纯文本等）
      if (typeof response !== 'string' || !response.trim().startsWith('{')) {
        return response;
      }

      let data: ApiResponse;
      try {
        data = JSON.parse(response);
      } catch {
        return response;
      }

      // ✅ token 失效：这里只 throw，不做跳转
      if (data.code === 'USR-001') {
        const err: any = new Error('UNAUTHORIZED');
        err.code = data.code;
        err.__IS_BUSINESS_ERROR__ = true;
        message.error(data.error);
        throw err;
      }

      // ✅ 工时重复提交
      if (data.code === 'WKE-002') {
        const backendError = data.error || data.message || '该任务在该周已提交过工时';
        message.error(backendError);

        const err: any = new Error('WORK_ENTRY_DUPLICATE');
        err.code = data.code;
        err.msg = backendError;
        err.__IS_BUSINESS_ERROR__ = true;
        throw err;
      }

      // ✅ 其他系统错误
      if (data.code === 'SYS-002') {
        const backendError = data.error || data.message || 'Internal Error, Please contact the admin';
        message.error(backendError);

        const err: any = new Error('INTERNAL_ERROR');
        err.code = data.code;
        err.msg = backendError;
        err.__IS_BUSINESS_ERROR__ = true;
        throw err;
      }

      // ✅ 其它非成功 code
      if (data.code !== 'SYS-000') {
        const backendError = data.message || '请求失败';
        message.error(backendError);

        const err: any = new Error('BUSINESS_ERROR');
        err.code = data.code;
        err.msg = backendError;
        err.__IS_BUSINESS_ERROR__ = true;
        throw err;
      }

      // ✅ 成功只返回 data
      return data.data;
    },
  ],
};
