import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';

export type SiderTheme = 'light' | 'dark';

/**
 * 自定义语言选择器：仅保留中英文
 */
export const SelectLang: React.FC = () => {
  return (
    <UmiSelectLang
      style={{ padding: 4 }}
      postLocalesData={(locales) =>
        locales.filter((item) => ['zh-CN', 'en-US'].includes(item.lang))
      }
    />
  );
};

export const Question: React.FC = () => {
  return (
    <a
      href="https://pro.ant.design/docs/getting-started"
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        padding: '4px',
        fontSize: '18px',
        color: 'inherit',
      }}
    >
      <QuestionCircleOutlined />
    </a>
  );
};
