
import React from 'react';
import { SiteContent, ContentKey } from '../types';
import EditableText from './EditableText';
import { COLORS } from '../constants';

interface ContactProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdate: (key: ContentKey, value: string) => void;
  onFontSizeUpdate: (key: string, size: number) => void;
}

const Contact: React.FC<ContactProps> = ({ content, isEditMode, onUpdate, onFontSizeUpdate }) => {
  // 관장님 제공 네이버 지도 직접 연결 링크
  const naverMapDirectUrl = `https://map.naver.com/p/entry/place/1936106538?c=18.75,0,0,0,dh&placePath=/home`;
  const kakaoMapUrl = `https://map.kakao.com/link/map/연세효태권도,37.56846,126.95831`;
  
  // 검색용 주소
  const cleanAddr = content.addr.split(' ').filter(word => !word.includes('호')).join(' ');
  const googleMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cleanAddr + " 연세효태권도")}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container mx-auto px-4 py-24 lg:px-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-black mb-4 inline-block relative after:content-[''] after:block after:w-20 after:h-1.5 after:bg-[#0047A0] after:mx-auto after:mt-6">
          상담문의 <span style={{ color: COLORS.primaryBlue }}>&</span> 오시는 길
        </h3>
        <p className="text-gray-500 mt-6 text-lg font-medium break-keep">우리 아이를 위한 바른 교육, 연세효 태권도에서 시작하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Naver Style Map Container */}
        <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 min-h-[500px] flex flex-col">
          {/* Map Content Area */}
          <div className="relative flex-1 bg-[#f4f4f4]">
            <iframe 
              src={googleMapSrc}
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'saturate(0.8) contrast(1.1) brightness(1.05)', pointerEvents: 'none' }} 
              allowFullScreen 
              loading="lazy"
              title="Dojo Location"
            ></iframe>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] flex flex-col items-center">
                <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 mb-2 flex items-center gap-2 animate-bounce">
                  <span className="text-[#03C75A] font-black text-sm">연세효 태권도</span>
                  <i className="fas fa-caret-right text-gray-300"></i>
                </div>
                <div className="relative w-10 h-10 bg-[#03C75A] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <i className="fas fa-map-marker-alt text-white"></i>
                  <div className="absolute -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#03C75A]"></div>
                </div>
              </div>
            </div>

            <a 
              href={naverMapDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-30 cursor-pointer group-hover:bg-green-900/5 transition-all flex items-center justify-center"
            >
              <div className="opacity-0 group-hover:opacity-100 bg-[#03C75A] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all transform translate-y-4 group-hover:translate-y-0 active:scale-95 font-black">
                <i className="fas fa-external-link-alt"></i>
                네이버 지도에서 상세보기
              </div>
            </a>
          </div>

          {/* Naver Place-like Bottom Card */}
          <div className="bg-white p-6 border-t border-gray-50 flex items-center justify-between z-40">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#03C75A]/10 flex items-center justify-center text-[#03C75A]">
                <i className="fas fa-building text-2xl"></i>
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 leading-tight">연세효 태권도장</h4>
                <p className="text-sm text-[#03C75A] font-bold">네이버 플레이스 정보 바로가기</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col justify-center space-y-10">
          <div className="flex items-start">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mr-8 shrink-0 shadow-sm border border-red-100">
              <i className="fas fa-map-marked-alt text-2xl"></i>
            </div>
            <div className="flex-1">
              <h5 className="font-black text-xl mb-2 text-gray-900">도장 주소</h5>
              <EditableText 
                value={content.addr}
                isEditMode={isEditMode}
                onUpdate={(v) => onUpdate('addr', v)}
                fontSize={content.fontSizes?.addr}
                onFontSizeUpdate={(size) => onFontSizeUpdate('addr', size)}
                className="text-gray-500 font-bold break-keep leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mr-8 shrink-0 shadow-sm border border-blue-100">
              <i className="fas fa-phone-alt text-2xl"></i>
            </div>
            <div>
              <h5 className="font-black text-xl mb-2 text-gray-900">상담 및 교육 문의</h5>
              <EditableText 
                value={content.tel}
                isEditMode={isEditMode}
                onUpdate={(v) => onUpdate('tel', v)}
                fontSize={content.fontSizes?.tel}
                onFontSizeUpdate={(size) => onFontSizeUpdate('tel', size)}
                className="font-black text-[#0047A0] hover:underline cursor-pointer tracking-tight"
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mr-8 shrink-0 shadow-sm border border-green-100">
              <i className="fas fa-clock text-2xl"></i>
            </div>
            <div className="flex-1">
              <h5 className="font-black text-xl mb-2 text-gray-900">운영 시간</h5>
              <EditableText 
                value={content.time}
                isEditMode={isEditMode}
                onUpdate={(v) => onUpdate('time', v)}
                fontSize={content.fontSizes?.time}
                onFontSizeUpdate={(size) => onFontSizeUpdate('time', size)}
                className="text-gray-500 leading-relaxed font-bold"
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
