
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
        return { ...DEFAULT_CONTENT, ...parsed };
      }
    } catch (e) {
      console.warn("Content Load Error");
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
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const [activeImgTarget, setActiveImgTarget] = useState<{key: ContentKey, index?: number} | null>(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('site_content', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem('site_posts', JSON.stringify(posts));
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

  const processImageFile = (file: File) => {
    if (!activeImgTarget) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result as string;
      if (activeImgTarget.key === 'heroImages' && activeImgTarget.index !== undefined) {
        const newImgs = [...content.heroImages];
        newImgs[activeImgTarget.index] = res;
        handleContentUpdate('heroImages', newImgs);
      } else {
        handleContentUpdate(activeImgTarget.key, res);
      }
      setActiveImgTarget(null);
    };
    reader.readAsDataURL(file);
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
          onAddImage={() => setContent(prev => ({ ...prev, heroImages: [...prev.heroImages, DEFAULT_CONTENT.heroImages[0]] }))}
          onRemoveImage={(idx) => setContent(prev => ({ ...prev, heroImages: prev.heroImages.filter((_, i) => i !== idx) }))}
        />
        
        {/* 1. 도장 소개 (관장님 인사말) */}
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

        {/* 2. 도장 SNS 채널 (인사말과 교육철학 사이 배치) */}
        <SocialConnect />

        {/* 3. 교육 철학 */}
        <section id="philosophy" className="bg-gray-50 scroll-mt-20">
          <Philosophy 
            content={content} 
            isEditMode={isEditMode} 
            onUpdate={handleContentUpdate} 
            onFontSizeUpdate={handleFontSizeUpdate} 
          />
        </section>

        {/* 4. 수련 프로그램 안내 */}
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

        {/* 5. 도장 소식 게시판 */}
        <section id="notice" className="bg-gray-50 scroll-mt-20">
          <NoticeBoard posts={posts} isEditMode={isEditMode} onAddPost={addPost} onDeletePost={deletePost} />
        </section>

        {/* 6. 상담 문의 및 오시는 길 */}
        <section id="contact" className="scroll-mt-20">
          <Contact content={content} isEditMode={isEditMode} onUpdate={handleContentUpdate} onFontSizeUpdate={handleFontSizeUpdate} />
        </section>

        {/* 7. 무료 체험 신청 폼 */}
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
