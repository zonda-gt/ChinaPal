import type { Metadata } from 'next';
import DominicClient from './client';
export const metadata: Metadata = {
  title: 'Dominic’s China Journey',
  description: '15–30 October 2026: Dominic’s personal journey through Shanghai, Zhangjiajie, Chongqing, Chengdu, Guangzhou and Shenzhen.',
  robots: { index: false, follow: false },
};
export default function Page() { return <DominicClient />; }
