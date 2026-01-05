
export interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  durationDays?: number; // 게시 유지 기간 (일 단위)
}

export interface SiteContent {
  logoImg: string;
  heroTitle: string;
  heroDesc: string;
  heroImages: string[];
  introSub: string;
  masterTitle: string;
  masterText: string;
  philo1T: string;
  philo1D: string;
  philo2T: string;
  philo2D: string;
  philo3T: string;
  philo3D: string;
  philo4T: string;
  philo4D: string;
  prog1Title: string;
  prog1Desc: string;
  prog2Title: string;
  prog2Desc: string;
  prog3Title: string;
  prog3Desc: string;
  prog4Title: string;
  prog4Desc: string;
  // 프로그램별 세부 항목
  prog1F1: string; prog1F2: string; prog1F3: string;
  prog2F1: string; prog2F2: string; prog2F3: string;
  prog3F1: string; prog3F2: string; prog3F3: string;
  prog4F1: string; prog4F2: string; prog4F3: string;
  addr: string;
  tel: string;
  time: string;
  masterImg: string;
  prog1Img: string;
  prog2Img: string;
  prog3Img: string;
  prog4Img: string;
  fontSizes?: Record<string, number>;
}

export type ContentKey = keyof SiteContent;
