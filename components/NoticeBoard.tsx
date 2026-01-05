
import React, { useState, useRef } from 'react';
import { Post } from '../types';
import { COLORS } from '../constants';

interface NoticeBoardProps {
  posts: Post[];
  isEditMode: boolean;
  onAddPost: (title: string, content: string, imageUrl?: string, durationDays?: number) => void;
  onDeletePost: (id: number) => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ posts, isEditMode, onAddPost, onDeletePost }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setNewImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddPost(newTitle, newContent, newImage, newDuration);
    setNewTitle('');
    setNewContent('');
    setNewDuration(30);
    setNewImage(undefined);
    setIsWriteModalOpen(false);
  };

  const processDelete = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까? 기간이 남았더라도 즉시 삭제됩니다.')) {
      onDeletePost(id);
      setViewingPost(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 lg:px-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-black mb-4 inline-block relative after:content-[''] after:block after:w-20 after:h-1.5 after:bg-[#0047A0] after:mx-auto after:mt-6">
          도장 <span style={{ color: COLORS.primaryBlue }}>소식</span>
        </h3>
        <p className="text-gray-500 mt-6 text-lg font-medium">연세효 태권도의 새로운 소식을 전해드립니다</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-400 font-bold text-sm">
            Total <span className="text-blue-700">{posts.length}</span> posts
          </p>
          {isEditMode && (
            <button 
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-black text-sm transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              <i className="fas fa-pen mr-2"></i> 소식 등록하기
            </button>
          )}
        </div>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-6 rounded-3xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer relative"
              onClick={() => setViewingPost(post)}
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {posts.length - index}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {post.imageUrl && <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Image</span>}
                  <h4 className="text-xl font-black text-gray-800 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 text-sm font-medium">{post.date}</p>
                  {post.durationDays && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold italic">
                      {post.durationDays}일간 게시
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-20">
                <span className="text-gray-300 group-hover:text-blue-300 hidden md:block">
                  <i className="fas fa-chevron-right"></i>
                </span>
                {isEditMode && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      processDelete(post.id);
                    }}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    title="삭제"
                  >
                    <i className="fas fa-trash-alt text-lg"></i>
                  </button>
                )}
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="py-32 text-center text-gray-300 flex flex-col items-center gap-4">
              <i className="fas fa-folder-open text-6xl opacity-20"></i>
              <p className="font-bold">등록된 소식이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Write Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b flex justify-between items-center">
              <h4 className="text-2xl font-black">새로운 소식 작성</h4>
              <button onClick={() => setIsWriteModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <i className="fas fa-times text-xl text-gray-400"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto text-left">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">제목</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="제목"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">게시 기간 (일)</label>
                  <input 
                    type="number" 
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">내용</label>
                <textarea 
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="내용을 입력하세요"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsWriteModalOpen(false)} className="px-8 py-4 bg-gray-100 rounded-2xl font-black">취소</button>
                <button type="submit" className="px-10 py-4 bg-blue-700 text-white rounded-2xl font-black shadow-xl">등록하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Post Modal */}
      {viewingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md text-left">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            <div className="p-8 border-b flex justify-between items-center shrink-0">
              <div className="flex flex-col">
                <span className="text-[11px] text-blue-600 font-black uppercase tracking-[0.2em] mb-2">Notice & Events</span>
                <h4 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{viewingPost.title}</h4>
              </div>
              <button 
                onClick={() => setViewingPost(null)} 
                className="w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
              >
                <i className="fas fa-times text-2xl text-gray-300 group-hover:text-gray-900"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-10 pb-6 border-b border-gray-50 font-medium">
                <div>작성일: {viewingPost.date}</div>
                <div className="w-[1px] h-3 bg-gray-200"></div>
                <div>게시기간: {viewingPost.durationDays}일</div>
              </div>
              <div className="text-gray-700 leading-relaxed text-lg md:text-xl whitespace-pre-wrap font-medium">
                {viewingPost.content}
              </div>
            </div>

            <div className="p-8 border-t bg-gray-50/50 flex justify-between items-center shrink-0 gap-4">
              {isEditMode && (
                <button 
                  onClick={() => processDelete(viewingPost.id)}
                  className="px-8 py-4 bg-red-50 text-red-600 rounded-full font-black hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <i className="fas fa-trash-alt"></i> 삭제하기
                </button>
              )}
              <button 
                onClick={() => setViewingPost(null)}
                className="flex-1 py-4 bg-gray-900 text-white rounded-full font-black hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
