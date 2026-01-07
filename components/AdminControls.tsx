
import React, { useState, useRef } from 'react';
import { SiteContent, Post } from '../types';

interface AdminControlsProps {
  isEditMode: boolean;
  toggleEdit: () => void;
  currentContent: SiteContent;
  currentPosts: Post[];
  onImport: (content: SiteContent, posts: Post[]) => void;
  saveStatus?: 'saved' | 'saving' | 'error';
}

const AdminControls: React.FC<AdminControlsProps> = ({ 
  isEditMode, 
  toggleEdit, 
  currentContent, 
  currentPosts,
  onImport,
  saveStatus = 'saved'
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
    const data = { content: currentContent, posts: currentPosts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yeonsei_hyo_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyForDeployment = () => {
    const data = { content: currentContent, posts: currentPosts };
    const text = JSON.stringify(data);
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ 배포용 데이터가 복사되었습니다!\n\n이제 채팅창에 이 내용을 붙여넣어 저에게 보내주세요.\n그 후 제가 업데이트를 완료하면 핸드폰에서도 수정한 내용이 똑같이 보이게 됩니다.");
    }).catch(() => {
      alert("복사에 실패했습니다. [내보내기] 버튼으로 파일을 저장해 전달해주세요.");
    });
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
          onImport(json.content, json.posts);
          alert("데이터를 성공적으로 불러왔습니다!");
        }
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col gap-3 items-start">
        {isEditMode && (
          <div className="flex flex-col gap-2 animate-fade-in-down bg-white/90 p-3 rounded-3xl shadow-2xl border border-blue-100 backdrop-blur-md">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 mb-1 ${
              saveStatus === 'saved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <i className={`fas ${saveStatus === 'saved' ? 'fa-check' : 'fa-sync animate-spin'}`}></i>
              {saveStatus === 'saved' ? '현재 기기에 임시 저장됨' : '저장 중...'}
            </div>

            <p className="text-[9px] text-gray-400 px-2 mb-2 leading-tight">
              * 핸드폰 동기화를 원하시면 아래 <br/><b>[배포 데이터 복사]</b>를 눌러 저에게 주세요.
            </p>

            <div className="flex gap-2">
              <button onClick={exportData} className="bg-gray-100 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-200" title="백업">
                <i className="fas fa-download"></i>
              </button>
              <button onClick={triggerImport} className="bg-gray-100 text-gray-700 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-200" title="복구">
                <i className="fas fa-upload"></i>
              </button>
              <button 
                onClick={copyForDeployment}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-black text-xs shadow-lg shadow-blue-200"
              >
                <i className="fas fa-cloud-upload-alt"></i> 배포 데이터 복사
              </button>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleImportFile} className="hidden" accept=".json" />
          </div>
        )}
        
        <button 
          onClick={handleAdminToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-2xl transition-all active:scale-95 ${
            isEditMode ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
          }`}
        >
          <i className={`fas ${isEditMode ? 'fa-times' : 'fa-cog'}`}></i>
          {isEditMode ? '편집 종료' : '관리자 모드'}
        </button>
      </div>

      {showLogin && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8 text-center animate-scale-up">
            <h3 className="text-xl font-black mb-4">관리자 로그인</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className={`w-full border-2 rounded-xl p-4 text-center text-2xl tracking-[0.5em] focus:outline-none ${error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-blue-600'}`}
                maxLength={4}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold">취소</button>
                <button type="submit" className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold">확인</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminControls;
