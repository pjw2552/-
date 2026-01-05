
import React from 'react';
import { COLORS } from '../constants';

const SocialConnect: React.FC = () => {
  const snsData = [
    {
      name: 'Instagram',
      title: '연세효 인스타그램',
      handle: '@yeonsehyotkd',
      desc: '아이들의 활기찬 수련 모습과 실시간 도장 일상을 확인하세요.',
      icon: 'fab fa-instagram',
      color: '#E1306C',
      link: 'https://www.instagram.com/yeonsehyotkd/',
      bg: 'bg-pink-50',
      borderColor: 'rgba(225, 48, 108, 0.2)',
      hoverBorder: 'rgba(225, 48, 108, 1)'
    },
    {
      name: 'Naver Place',
      title: '연세효 네이버 플레이스',
      handle: '리뷰 및 장소 정보',
      desc: '정확한 위치 정보, 방문자 리뷰, 도장 시설 정보를 확인하세요.',
      icon: 'fas fa-map-marker-alt',
      color: '#00C73C',
      link: 'https://m.place.naver.com/place/1936106538/information',
      bg: 'bg-green-50',
      borderColor: 'rgba(0, 199, 60, 0.2)',
      hoverBorder: 'rgba(0, 199, 60, 1)'
    }
  ];

  return (
    <section id="social" className="py-24 bg-white overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-20 text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-black mb-4 inline-block relative after:content-[''] after:block after:w-20 after:h-1.5 after:bg-[#0047A0] after:mx-auto after:mt-6">
          연세효 <span style={{ color: COLORS.primaryBlue }}>SNS 채널</span>
        </h3>
        <p className="text-gray-500 mt-6 text-lg md:text-xl font-medium">실시간 수련 현황과 교육 정보를 확인해보세요</p>
      </div>

      <div className="container mx-auto px-4 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        {snsData.map((sns, idx) => (
          <a 
            key={idx}
            href={sns.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-[3rem] p-12 flex flex-col items-center justify-center text-center transition-all duration-700 border-[6px] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 ${sns.bg}`}
            style={{ 
              borderColor: sns.borderColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = sns.hoverBorder;
              e.currentTarget.style.boxShadow = `0 25px 50px -12px ${sns.borderColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = sns.borderColor;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div 
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 bg-white shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"
              style={{ color: sns.color }}
            >
              <i className={`${sns.icon} text-5xl`}></i>
            </div>
            
            <div className="mb-4">
              <h4 className="text-3xl font-black text-gray-900 mb-1">{sns.title}</h4>
              <p className="text-sm font-black opacity-60 tracking-widest uppercase" style={{ color: sns.color }}>{sns.handle}</p>
            </div>
            
            <p className="text-gray-600 mb-10 max-w-sm font-bold leading-relaxed text-lg">
              {sns.desc}
            </p>
            
            <div 
              className="px-10 py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl group-hover:shadow-2xl active:scale-95 flex items-center gap-3"
              style={{ backgroundColor: sns.color }}
            >
              <span>방문하기</span>
              <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
            </div>
            
            {/* Background Icon Decoration */}
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-all duration-1000 pointer-events-none group-hover:-rotate-12 group-hover:scale-125">
               <i className={`${sns.icon} text-[240px]`}></i>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SocialConnect;
