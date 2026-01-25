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

const App: React.FC = () => {
  const DEFAULT_DURATION = 30;

  // --- State Initialization ---
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      // 배포 버전이 업데이트되었을 때, 이전의 잘못된 데이터가 화면을 가리는 것을 방지하기 위해
      // 소스 코드의 DEFAULT_CONTENT를 가장 먼저 고려하도록 합니다.
      const saved = localStorage.getItem('site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 기본값과 병합하되, 배열 데이터는 기본값을 우선시하거나 안전하게 처리
        const merged = { ...DEFAULT_CONTENT, ...parsed };
        if (!Array.isArray(merged.heroImages) || merged.heroImages.length === 0) {
          merged.heroImages = [...DEFAULT_CONTENT.heroImages];
        }
        merged.fontSizes = { ...DEFAULT_CONTENT.fontSizes, ...(parsed.fontSizes || {}) };
        return merged;
      }
    } catch (e) {
      console.warn("Storage Load Error, using defaults");
    }
    return DEFAULT_CONTENT;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('site_posts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      return INITIAL_POSTS;
    }
    return INITIAL_POSTS;
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [activeImgTarget, setActiveImgTarget] = useState<{key: ContentKey, index?: number} | null>(null);

  // --- Persistence (Fixed Loop) ---
  useEffect(() => {
    // 편집 모드일 때만 명시적으로 저장
    if (!isEditMode) return;

    const timer = setTimeout(() => {
      setSaveStatus('saving');
      try {
        localStorage.setItem('site_content', JSON.stringify(content));
        localStorage.setItem('site_posts', JSON.stringify(posts));
        setSaveStatus('saved');
      } catch (e) {
        setSaveStatus('error');
      }
    }, 1000);
    
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
    setContent(newContent);
    setPosts(newPosts);
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
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
          } else {
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
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
      alert("이미지 처리 실패");
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
      <input type="file" ref={imageUploadRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) processImageFile(file); }} />
    </div>
  );
};

export default App;