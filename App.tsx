
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
      const saved = localStorage.getItem('site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_CONTENT, ...parsed };
        if (!Array.isArray(merged.heroImages)) {
          merged.heroImages = DEFAULT_CONTENT.heroImages;
        }
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
      return freshPosts;
    } catch (e) {
      return INITIAL_POSTS;
    }
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [activeImgTarget, setActiveImgTarget] = useState<{key: ContentKey, index?: number} | null>(null);

  // --- Persistence with Error Handling ---
  useEffect(() => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('site_content', JSON.stringify(content));
      setSaveStatus('saved');
    } catch (e) {
      console.error("Storage Error:", e);
      setSaveStatus('error');
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert("저장 공간이 부족합니다. 이미지를 너무 많이 넣었거나 고화질 사진일 수 있습니다. 사진 개수를 줄여주세요.");
      }
    }
  }, [content]);

  useEffect(() => {
    try {
      localStorage.setItem('site_posts', JSON.stringify(posts));
    } catch (e) {
      console.error("Error saving posts.");
    }
  }, [posts]);

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
  }, []);

  // --- Image Processing (Optimization for Mobile Storage) ---
  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // 모바일 저장소 한계를 고려해 최대 크기를 더 축소 (800px)
          const MAX_SIZE = 800; 
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
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          // 압축률을 0.5로 높여 용량 최소화 (모바일 웹 환경 최적화)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
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
        if (newImgs.length === 0) newImgs.push(DEFAULT_CONTENT.heroImages[0]);
        newImgs[activeImgTarget.index] = compressedImg;
        handleContentUpdate('heroImages', newImgs);
      } else {
        handleContentUpdate(activeImgTarget.key, compressedImg);
      }
    } catch (err) {
      console.error("Image processing failed:", err);
      alert("사진을 처리하는 중 오류가 발생했습니다.");
    } finally {
      setActiveImgTarget(null);
    }
  };

  return (
    <div className={`relative min-h-screen ${isEditMode ? 'admin-active' : ''}`}>
      <Navbar 
        content={content} 
        isEditMode={isEditMode} 
        onImageClick={() => handleImageClick('logoImg')} 
      />
      
      <main>
        <Hero 
          content={content} 
          isEditMode={isEditMode} 
          onUpdate={handleContentUpdate}
          onFontSizeUpdate={handleFontSizeUpdate}
          onImageClick={(idx) => handleImageClick('heroImages', idx)}
          onAddImage={() => setContent(prev => ({ ...prev, heroImages: [...(prev.heroImages || DEFAULT_CONTENT.heroImages), DEFAULT_CONTENT.heroImages[0]] }))}
          onRemoveImage={(idx) => setContent(prev => ({ ...prev, heroImages: (prev.heroImages || []).filter((_, i) => i !== idx) }))}
        />
        
        <section id="intro" className="scroll-mt-20">
          <Intro 
            content={content} 
            isEditMode={isEditMode} 
            onUpdate={handleContentUpdate} 
            onImageClick={(key) => handleImageClick(key)}
            onImageDrop={(key, file) => {
              setActiveImgTarget({ key });
              processImageFile(file);
            }}
          />
        </section>

        <SocialConnect />

        <section id="philosophy" className="bg-gray-50 scroll-mt-20">
          <Philosophy 
            content={content} 
            isEditMode={isEditMode} 
            onUpdate={handleContentUpdate} 
            onFontSizeUpdate={handleFontSizeUpdate} 
          />
        </section>

        <section id="programs" className="scroll-mt-20">
          <Programs 
            content={content} 
            isEditMode={isEditMode} 
            onUpdate={handleContentUpdate} 
            onFontSizeUpdate={handleFontSizeUpdate} 
            onImageClick={(key) => handleImageClick(key)}
            onImageDrop={(key, file) => {
              setActiveImgTarget({ key });
              processImageFile(file);
            }}
          />
        </section>

        <section id="notice" className="bg-gray-50 scroll-mt-20">
          <NoticeBoard posts={posts} isEditMode={isEditMode} onAddPost={addPost} onDeletePost={deletePost} />
        </section>

        <section id="contact" className="scroll-mt-20">
          <Contact content={content} isEditMode={isEditMode} onUpdate={handleContentUpdate} onFontSizeUpdate={handleFontSizeUpdate} />
        </section>

        <section id="apply" className="bg-blue-50 scroll-mt-20">
          <ApplicationForm />
        </section>
      </main>

      <Footer />
      
      <AdminControls 
        isEditMode={isEditMode} 
        toggleEdit={() => setIsEditMode(!isEditMode)} 
        currentContent={content} 
        currentPosts={posts} 
        onImport={handleImportData}
        saveStatus={saveStatus}
      />

      <input 
        type="file" 
        ref={imageUploadRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processImageFile(file);
        }} 
      />
    </div>
  );
};

export default App;
