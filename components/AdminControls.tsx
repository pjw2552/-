
import React, { useState, useRef } from 'react';
import { SiteContent, Post } from '../types';

interface AdminControlsProps {
  isEditMode: boolean;
  toggleEdit: () => void;
  currentContent: SiteContent;
  currentPosts: Post[];
  onImport: (content: SiteContent, posts: Post[]) => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({ 
  isEditMode, 
  toggleEdit, 
  currentContent, 
  currentPosts,
  onImport
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminToggle = () => {
    if (isEditMode) {
      toggleEdit();
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2552') {
      toggleEdit();
      setShowLogin(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const exportData = () => {
    const data = {
      content: currentContent,
      posts: currentPosts,
      version: "1.0",
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yeonsei_hyo_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.content && json.posts) {
          if (window.confirm('기존 데이터가 덮어씌워집니다. 계속하시겠습니까?')) {
            onImport(json.content, json.posts);
          }
        } else {
          alert('올바른 백업 파일 형식이 아닙니다.');
        }
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset for next selection
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col gap-3 items-start">
        {isEditMode && (
          <div className="flex gap-2 animate-fade-in-down">
            <button 
              onClick={exportData}
              className="bg-blue-600 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"
              title="데이터 파일로 저장 (백업)"
            >
              <i className="fas fa-download"></i>
            </button>
            <button 
              onClick={triggerImport}
              className="bg-green-600 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 transition-all hover:scale-110"
              title="데이터 불러오기 (복구)"
            >
              <i className="fas fa-upload"></i>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportFile} 
              className="hidden" 
              accept=".json" 
            />
          </div>
        )}
        
        <div className="flex flex-col items-start">
          <button 
            onClick={handleAdminToggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-2xl transition-all active:scale-95 ${
              isEditMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-900 text-white hover:bg-black'
            }`}
          >
            <i className={`fas ${isEditMode ? 'fa-times' : 'fa-cog'} text-lg`}></i>
            {isEditMode ? '편집 종료' : '관리자 모드'}
          </button>
          {isEditMode && (
            <div className="mt-2 ml-4 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full animate-bounce shadow-lg text-center font-bold">
              편집 중...
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <i className="fas fa-lock text-2xl"></i>
              </div>
              <h3 className="text-xl font-black mb-2">관리자 로그인</h3>
              <p className="text-gray-500 text-sm mb-6">수정을 위해 비밀번호를 입력해주세요.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input 
                    type="password" 
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 4자리"
                    className={`w-full border-2 rounded-xl p-4 text-center text-2xl tracking-[1em] focus:outline-none transition-all ${
                      error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-blue-600'
                    }`}
                    maxLength={4}
                  />
                  {error && <p className="text-red-500 text-xs mt-2 font-bold">비밀번호가 틀렸습니다.</p>}
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowLogin(false)}
                    className="flex-1 py-4 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                  >
                    확인
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminControls;
