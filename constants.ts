import { SiteContent, Post } from './types';

export const COLORS = {
  primaryRed: '#CD2E3A',
  primaryBlue: '#0047A0',
};

// 기본 사이트 콘텐츠 데이터
export const DEFAULT_CONTENT: SiteContent = {
  logoImg: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  heroTitle: "운동을 넘어\n아이의 삶의 태도를 키웁니다",
  heroDesc: "사랑으로 가르치고 믿음으로 성장하는 연세효 태권도장",
  heroImages: [
    "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1600",
  ],
  introSub: "인성 교육을 최우선으로 하는 연세효 태권도",
  masterTitle: "관장 한상윤",
  masterText: "안녕하십니까. 연세효 태권도장 관장 한상윤입니다. 저희 도장은 아이들이 올바른 가치관을 가지고 건강하게 성장할 수 있도록 최선을 다하고 있습니다.",
  philo1T: "예의",
  philo1D: "상호 존중과 바른 인성을 교육합니다.",
  philo2T: "인내",
  philo2D: "어려움을 극복하는 강인한 정신력을 기릅니다.",
  philo3T: "염치",
  philo3D: "옳고 그름을 아는 정직함을 가르칩니다.",
  philo4T: "극기",
  philo4D: "자신의 욕망을 이겨내는 자제력을 배웁니다.",
  prog1Title: "유치부 키즈반",
  prog1Desc: "놀이 중심의 활동을 통한 신체 발달",
  prog2Title: "초등부 정규반",
  prog2Desc: "기초 체력 증진 및 인성 교육",
  prog3Title: "줄넘기 전문반",
  prog3Desc: "성장판 자극 및 유산소 운동",
  prog4Title: "시범단 · 중고등부",
  prog4Desc: "고난도 기술 및 입시 준비",
  prog1F1: "기초 운동 능력",
  prog1F2: "예절 교육",
  prog1F3: "사회성 발달",
  prog2F1: "태권도 기본동작",
  prog2F2: "품새 및 발차기",
  prog2F3: "집중력 향상",
  prog3F1: "급수별 줄넘기",
  prog3F2: "음악 줄넘기",
  prog3F3: "비만 관리",
  prog4F1: "시범 기술 교육",
  prog4F2: "리더십 배양",
  prog4F3: "진로 상담",
  addr: "서울 서대문구 독립문로8길 54",
  tel: "010-9393-4033",
  time: "평일 13:00 ~ 21:00\n주말 및 공휴일 휴무",
  masterImg: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=800",
  prog1Img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800",
  prog2Img: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?auto=format&fit=crop&q=80&w=800",
  prog3Img: "https://images.unsplash.com/photo-1517438476312-10d79c67750d?auto=format&fit=crop&q=80&w=800",
  prog4Img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
  fontSizes: {}
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: "연세효 태권도 홈페이지 오픈",
    content: "우리 아이들의 건강한 성장을 위해 소통하는 공간이 마련되었습니다.",
    date: new Date().toISOString().split('T')[0],
    durationDays: 365
  }
];
