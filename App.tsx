
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SiteContent, ContentKey, Post } from './types';
import { DEFAULT_CONTENT, INITIAL_POSTS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Philosophy from './components/Philosophy';
import Programs from './components/Programs';
import NoticeBoard from './components/NoticeBoard';
import Contact from './components/Contact';
import ApplicationForm from './components/ApplicationForm';
import Footer from './components/Footer';
import AdminControls from './components/AdminControls';
import SocialConnect from './components/SocialConnect';
import AIConsultant from './components/AIConsultant';

const App: React.FC = () => {
  const DEFAULT_DURATION = 30;

  // --- State Initialization ---
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      // 배포 버전에서는 localStorage보다 DEFAULT_CONTENT가 더 최신일 수 있으므로 
      // 로컬 스토리지가 비어있을 때 확실하게 상수를 사용하도록 합니다.
      const saved = localStorage.getItem('site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 저장된 데이터와 기본 데이터를 합칩니다 (새로 추가된 필드 대응)
        const merged = { ...DEFAULT_CONTENT, ...parsed };
        
        // heroImages 배열 보정
        if (!Array.isArray(merged.heroImages) || merged.heroImages.length === 0) {
          merged.heroImages = [...DEFAULT_CONTENT.heroImages];
        }
        
        // 폰트 사이즈 보정 (상수값 우선 적용이 필요한 경우 여기서 처리 가능)
        merged.fontSizes = { ...DEFAULT_CONTENT.fontSizes, ...parsed.fontSizes };
        
        return merged;
      }
    } catch (e) {
      console.warn("Content Load Error, using defaults");
    }
    return DEFAULT_CONTENT;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('site_posts');
      const loadedPosts: Post[] = saved ? JSON.parse(saved) : INITIAL_POSTS;
      
      const now = new Date().getTime();
      const freshPosts = loadedPosts.filter(post => {
        if (!post.date) return false;
        const [year, month, day] = post.date.split('-').map(Number);
        const postDate = new Date(year, month - 1, day).getTime();
        const durationMs = (post.durationDays || DEFAULT_DURATION) * 24 * 60 * 60 * 1000;
        return isNaN(postDate) || (now - postDate) < durationMs;
      });
      // 게시글이 하나도 없다면 기본 게시글 로드
      return freshPosts.length > 0 ? freshPosts : INITIAL_POSTS;
    } catch (e) {
      return INITIAL_POSTS;
    }
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [activeImgTarget, setActiveImgTarget] = useState<{key: ContentKey, index?: number} | null>(null);

  // --- Persistence ---
  useEffect(() => {
    if (!isEditMode && saveStatus === 'saved') return; // 편집 모드가 아닐 때는 저장 건너뜀 (성능 최적화)
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('site_content', JSON.stringify(content));
        localStorage.setItem('site_posts', JSON.stringify(posts));
        setSaveStatus('saved');
      } catch (e) {
        console.error("Storage Error:", e);
        setSaveStatus('error');
      }
    }, 500); // 디바운싱 효과
    
    return () => clearTimeout(timer);
  }, [content, posts, isEditMode]);

  // --- Handlers ---
  const handleContentUpdate = useCallback((key: ContentKey, value: any) => {
    setContent(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFontSizeUpdate = useCallback((key: string, size: number) => {
    setContent(prev => ({
      ...prev,
      fontSizes: { ...(prev.fontSizes || {}), [key]: size }
    }));
  }, []);

  const handleImageClick = useCallback((key: ContentKey, index?: number) => {
    if (isEditMode && imageUploadRef.current) {
      setActiveImgTarget({ key, index });
      imageUploadRef.current.value = ''; 
      imageUploadRef.current.click();
    }
  }, [isEditMode]);

  const addPost = useCallback((title: string, contentStr: string, imageUrl?: string, durationDays?: number) => {
    const newPost: Post = {
      id: Date.now(),
      title,
      content: contentStr,
      imageUrl,
      durationDays: durationDays || DEFAULT_DURATION,
      date: new Date().toISOString().split('T')[0],
    };
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const deletePost = useCallback((id: number) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  }, []);

  const handleImportData = useCallback((newContent: SiteContent, newPosts: Post[]) => {
    if (newContent.heroImages && !Array.isArray(newContent.heroImages)) {
        newContent.heroImages = [newContent.heroImages];
    }
    setContent(newContent);
    setPosts(newPosts);
    // 임포트 시 즉시 로컬 스토리지 업데이트
    localStorage.setItem('site_content', JSON.stringify(newContent));
    localStorage.setItem('site_posts', JSON.stringify(newPosts));
  }, []);

  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1000; // 품질과 성능 균형
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const processImageFile = async (file: File) => {
    if (!activeImgTarget) return;
    try {
      const compressedImg = await compressAndResizeImage(file);
      if (activeImgTarget.key === 'heroImages' && activeImgTarget.index !== undefined) {
        const newImgs = [...(content.heroImages || [])];
        newImgs[activeImgTarget.index] = compressedImg;
        handleContentUpdate('heroImages', newImgs);
      } else {
        handleContentUpdate(activeImgTarget.key, compressedImg);
      }
    } catch (err) {
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setActiveImgTarget(null);
    }
  };

  return (
    <div className={`relative min-h-screen ${isEditMode ? 'admin-active' : ''}`}>
      <Navbar content={content} isEditMode={isEditMode} onImageClick={() => handleImageClick('logoImg')} />
      <main>
        <Hero 
          content={content} 
          isEditMode={isEditMode} 
          onUpdate={handleContentUpdate}
          onFontSizeUpdate={handleFontSizeUpdate}
          onImageClick={(idx) => handleImageClick('heroImages', idx)}
          onAddImage={() => setContent(prev => ({ ...prev, heroImages: [...(prev.heroImages || []), DEFAULT_CONTENT.heroImages[0]] }))}
          onRemoveImage={(idx) => setContent(prev => ({ ...prev, heroImages: (prev.heroImages || []).filter((_, i) => i !== idx) }))}
        />
        <section id="intro"><Intro content={content} isEditMode={isEditMode} onUpdate={handleContentUpdate} onImageClick={(key) => handleImageClick(key)} /></section>
        <SocialConnect />
        <section id="philosophy" className="bg-gray-50"><Philosophy content={content} isEditMode={isEditMode} onUpdate={handleContentUpdate} onFontSizeUpdate={handleFontSizeUpdate} /></section>
        <section id="programs"><Programs content={content} isEditMode={isEditMode} onUpdate={handleContentUpdate} onFontSizeUpdate={handleFontSizeUpdate} onImageClick={(key) => handleImageClick(key)} /></section>
        <section id="notice" className="bg-gray-50"><NoticeBoard posts={posts} isEditMode={isEditMode} onAddPost={addPost} onDeletePost={deletePost} /></section>
        <section id="contact"><Contact content={content} isEditMode={isEditMode} onUpdate={handleContentUpdate} onFontSizeUpdate={handleFontSizeUpdate} /></section>
        <section id="apply" className="bg-blue-50"><ApplicationForm /></section>
      </main>
      <Footer />
      <AdminControls isEditMode={isEditMode} toggleEdit={() => setIsEditMode(!isEditMode)} currentContent={content} currentPosts={posts} onImport={handleImportData} saveStatus={saveStatus} />
      <AIConsultant />
      <input type="file" ref={imageUploadRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) processImageFile(file); }} />
    </div>
  );
};

export default App;
