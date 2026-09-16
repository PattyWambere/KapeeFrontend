import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import contentService, {
  type BlogPost,
  type AboutContent,
} from "../api/content.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentContextValue {
  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, "id">) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: number) => void;
  resetBlogPosts: () => void;

  // About
  aboutContent: AboutContent;
  updateAboutContent: (data: AboutContent) => void;
  resetAboutContent: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ContentContext = createContext<ContentContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() =>
    contentService.getBlogPosts()
  );

  const [aboutContent, setAboutContent] = useState<AboutContent>(() =>
    contentService.getAboutContent()
  );

  // ── Blog actions ──────────────────────────────────────────────────────────

  const addBlogPost = useCallback((post: Omit<BlogPost, "id">) => {
    const newPost = contentService.addBlogPost(post);
    setBlogPosts(contentService.getBlogPosts());
    return newPost;
  }, []);

  const updateBlogPost = useCallback((post: BlogPost) => {
    contentService.updateBlogPost(post);
    setBlogPosts(contentService.getBlogPosts());
  }, []);

  const deleteBlogPost = useCallback((id: number) => {
    contentService.deleteBlogPost(id);
    setBlogPosts(contentService.getBlogPosts());
  }, []);

  const resetBlogPosts = useCallback(() => {
    contentService.resetBlogPosts();
    setBlogPosts(contentService.getBlogPosts());
  }, []);

  // ── About actions ─────────────────────────────────────────────────────────

  const updateAboutContent = useCallback((data: AboutContent) => {
    contentService.saveAboutContent(data);
    setAboutContent(data);
  }, []);

  const resetAboutContent = useCallback(() => {
    contentService.resetAboutContent();
    setAboutContent(contentService.getAboutContent());
  }, []);

  return (
    <ContentContext.Provider
      value={{
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        resetBlogPosts,
        aboutContent,
        updateAboutContent,
        resetAboutContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useContent = (): ContentContextValue => {
  const ctx = useContext(ContentContext);
  if (!ctx)
    throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
};

export default ContentContext;
