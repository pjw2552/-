
import React, { useState } from 'react';
import { COLORS } from '../constants';

const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentContact: '',
    age: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.parentContact) {
      alert('이름과 연락처는 필수 입력 항목입니다.');
      return;
    }

    setIsSubmitting(true);
    
    // 문자 메시지 본문 구성
    const smsMessage = `[연세효 태권도 무료체험 신청]\n이름: ${formData.studentName}\n나이: ${formData.age}\n연락처: ${formData.parentContact}\n문의: ${formData.message}`;
    
    // SMS 전송을 위한 URI 생성 (010-9393-4033)
    // iOS와 Android의 SMS 프로토콜 차이를 고려하여 인코딩 처리
    const smsUrl = `sms:01093934033?body=${encodeURIComponent(smsMessage)}`;

    // 시뮬레이션 후 문자 앱 연결
    setTimeout(() => {
      window.location.href = smsUrl;
      
      alert(`${formData.studentName} 학생의 정보로 문자 메시지 앱을 연결합니다.\n메시지 창에서 '전송' 버튼을 눌러주세요!`);
      
      setFormData({
        studentName: '',
        parentContact: '',
        age: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-20 lg:px-20 max-w-5xl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-blue-100">
        {/* Left Side: Info */}
        <div className="md:w-2/5 bg-gray-900 p-10 text-white flex flex-col justify-center">
          <div>
            <span style={{ color: COLORS.primaryRed }} className="font-black text-sm uppercase tracking-widest mb-4 block">Free Experience</span>
            <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              우리 아이의 <br />
              첫 태권도, <br />
              <span style={{ color: COLORS.primaryBlue }}>연세효</span>와 함께
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              무료 체험 수련을 통해 도장의 분위기와 교육 프로그램을 미리 경험해보세요. 우리 아이에게 딱 맞는 운동인지 확인할 수 있는 좋은 기회입니다.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-10 md:p-14 bg-white">
          <h4 className="text-2xl font-black mb-8 text-gray-900">무료 체험 신청서</h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">학생 이름</label>
                <input 
                  type="text" 
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  placeholder="아이 이름을 입력하세요"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">연령/학년</label>
                <input 
                  type="text" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="예) 7세, 초등 2학년"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">학부모 연락처</label>
              <input 
                type="tel" 
                name="parentContact"
                value={formData.parentContact}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">문의 및 희망 시간 (선택)</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="궁금하신 점이나 희망하는 수련 시간을 적어주세요."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all shadow-xl shadow-red-100 hover:shadow-red-200 active:scale-[0.98] ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#CD2E3A] hover:bg-[#b01b26]'
              }`}
            >
              {isSubmitting ? (
                <i className="fas fa-circle-notch animate-spin mr-2"></i>
              ) : (
                <i className="fas fa-paper-plane mr-2"></i>
              )}
              문자로 신청하기 (010-9393-4033)
            </button>
            <p className="text-center text-[10px] text-gray-400 font-medium">
              * 버튼을 누르면 작성된 내용이 포함된 문자 메시지 앱이 실행됩니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
