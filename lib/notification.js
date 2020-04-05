import { message } from 'antd';

export const notify = (type = 'info', content, duration = 2) => message[type](content, duration);
