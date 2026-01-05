import { SiteContent, Post } from './types';

export const COLORS = {
  primaryRed: '#CD2E3A',
  primaryBlue: '#0047A0',
};

export const DEFAULT_CONTENT: SiteContent = {
  logoImg: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  heroTitle: "운동을 넘어\n아이의 삶의 태도를 키웁니다",
  heroDesc: "사랑으로 가르치고 믿음으로 성장하는 연세효 태권도장",
  heroImages: [
    "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ],
  introSub: "우리 아이들이 올바르게 성장할 수 있도록 지도합니다",
  masterTitle: "\"바른 인성이 진정한 실력입니다\"",
  masterText: "안녕하십니까, 연세효 태권도 관장입니다.\n\n태권도는 단순한 신체 단련이 아닙니다.\n자신을 이기는 극기, 타인을 존중하는 예절,\n그리고 포기하지 않는 끈기를 배우는 과정입니다.\n\n우리 아이들이 도장에서 흘린 땀방울만큼\n몸과 마음이 건강한 리더로 성장하도록\n사랑과 정성으로 지도하겠습니다.",
  philo1T: "인성 교육",
  philo1D: "인사는 마음의 문을 여는 열쇠입니다. 바른 예절과 효를 통해 성숙한 인격을 형성합니다.",
  philo2T: "자신감",
  philo2D: "실패를 두려워하지 않는 용기! 반복된 성공 경험을 통해 단단한 자존감을 세워줍니다.",
  philo3T: "사회성",
  philo3D: "함께 땀 흘리며 배우는 화합의 가치! 배려와 존중을 실천하는 리더로 성장합니다.",
  philo4T: "기초 체력",
  philo4D: "건강한 신체에 바른 정신이 깃듭니다. 균형 잡힌 신체 발달로 성장의 토대를 마련합니다.",
  prog1Title: "유치부 키즈반",
  prog1Desc: "즐거운 놀이 체육을 통해 운동에 흥미를 느끼고, 단체 생활의 규칙과 기초 예절을 즐겁게 배웁니다.",
  prog1F1: "키성장 체조 & 유아 태권도",
  prog1F2: "유아체육",
  prog1F3: "생활 예절 교육",
  prog2Title: "초등부 정규반",
  prog2Desc: "체계적인 태권도 기술 습득과 더불어 학교 체육, 인성 교육을 병행하여 리더십을 키웁니다.",
  prog2F1: "정통 품새 및 실전 겨루기",
  prog2F2: "학교 체육 프로그램",
  prog2F3: "자신감 향상 스피치",
  prog3Title: "줄넘기 전문반",
  prog3Desc: "기초부터 고난도 기술까지, 음악 줄넘기와 급수 줄넘기를 통해 체력과 키 성장을 돕습니다.",
  prog3F1: "음악 줄넘기 & 급수제",
  prog3F2: "기초 체력 및 키 성장",
  prog3F3: "체중 관리 프로그램",
  prog4Title: "시범단 · 중고등부",
  prog4Desc: "고난도 품새와 격파, 시범 기술을 연마하며 체력 증진은 물론 진로를 위한 전문 수련을 진행합니다.",
  prog4F1: "고난도 기계체조 및 격파",
  prog4F2: "시범 공연 및 대회 참가",
  prog4F3: "체대 입시 및 단증 취득",
  addr: "서울 서대문구 독립문로8길 54 천연뜨란채 아파트 상가 301호",
  tel: "010-9393-4033",
  time: "월~금 수련 시간표\n\n2시부 : 14:00 ~ 15:00 (유치부/초등부)\n3시부 : 15:00 ~ 16:00 (유치부/초등부)\n4시부 : 16:00 ~ 17:00 (유치부/초등부)\n5시부 : 17:00 ~ 18:00 (유치부/초등부)\n6시부 : 18:00 ~ 19:00 (유치부/초등부)\n줄넘기클럽 : 19:00 ~ 20:00 (누구나)\n8시부 : 20:00 ~ 22:00 (시범단/중고등부)",
  masterImg: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  prog1Img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  prog2Img: "https://images.unsplash.com/photo-1521412644187-c49fa0b3e248?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  prog3Img: "https://images.unsplash.com/photo-1434596922112-19c563067271?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  prog4Img: "https://images.unsplash.com/photo-1552072805-2a9039d00e57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  fontSizes: {
    heroTitle: 64,
    heroDesc: 24,
    introSub: 18,
    masterTitle: 32,
    masterText: 18,
    philoT: 20,
    philoD: 14,
    progTitle: 20,
    progDesc: 14,
    progFeature: 12,
    addr: 18,
    tel: 30,
    time: 18
  }
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: "연세효 태권도 홈페이지 오픈 안내",
    content: "학부모님들과 더 가깝게 소통하기 위한 공식 홈페이지가 오픈되었습니다. 많은 관심 부탁드립니다.",
    date: new Date().toISOString().split('T')[0],
    durationDays: 365
  }
];
