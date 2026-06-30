import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import React from 'react';
import {
  AvatarDropdown,
  AvatarName,
  Footer,
  Question,
  SelectLang,
} from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

declare const API_BASE_URL: string;
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // ✅ 方案A：不要 skipErrorHandler，让全局 errorHandler 接管 USR-001 的跳转逻辑
      const msg = await queryCurrentUser();

      // ✅ 后端返回结构 { code, message, data } 或已经被 transformResponse 处理成纯 data
      // 兼容两种情况：
      return (msg as any)?.data || (msg as any);
    } catch (_error) {
      // 只做清理，不做跳转（跳转交给 requestErrorConfig 的 errorHandler）
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return undefined;
    }
  };

  const { location } = history;

  // ✅ 1️⃣ 优先从 localStorage 读取登录信息
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let cachedUser: API.CurrentUser | null = null;
  if (token && userStr) {
    try {
      cachedUser = JSON.parse(userStr);
    } catch {
      localStorage.removeItem('user');
    }
  }

  // ✅ 2️⃣ 若当前不是登录页
  if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
    // 如果本地有用户缓存，就先返回（避免闪屏）
    if (cachedUser) {
      return {
        fetchUserInfo,
        currentUser: cachedUser,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }

    // 否则向后端请求当前用户信息
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  // ✅ 登录页返回空用户
  return {
    fetchUserInfo,
    currentUser: cachedUser || undefined,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const loginPath = '/user/login';
      const moodLoginPath = '/mood/login';

      const currentPath = location.pathname;
      const whiteList = [loginPath, moodLoginPath];

      // ✅ 如果未登录，且不在白名单中，并且不是 mood 模块页面（你原逻辑保留）
      if (
        !initialState?.currentUser &&
        !whiteList.includes(currentPath) &&
        !currentPath.startsWith('/mood')
      ) {
        history.push(loginPath);
      }
    },

    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    childrenRender: (children) => {
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * request 配置
 */
export const request: RequestConfig = {
  baseURL: API_BASE_URL,
  ...errorConfig,
};
