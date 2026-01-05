
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-4">
      <div className="container mx-auto text-center">
        <p className="text-white font-black text-xl mb-4 tracking-tighter">
          연세<span className="text-red-600">효</span> 태권도장
        </p>
        <div className="space-y-2 text-sm md:text-base mb-8">
          <p>대표: 한상윤</p>
          <p>주소: 서울 서대문구 독립문로8길 54 | Tel: 010-9393-4033</p>
        </div>
        <p className="text-xs opacity-50 border-t border-gray-800 pt-8 max-w-xl mx-auto">
          © 2024 Yeonsei Hyo Taekwondo. All Rights Reserved.
          <br />
          본 웹사이트의 콘텐츠는 무단 전재 및 재배포를 금지합니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
