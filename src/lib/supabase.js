// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Research Articles API
export const articlesAPI = {
  // Get all published research articles
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('research_articles')
        .select('*')
        .eq('published', true)
        .order('publication_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Get single article by slug
  getBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('research_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;

      // Increment view count
      if (data) {
        await supabase.rpc('increment_research_views', { article_id: data.id });
      }

      return data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Get featured articles
  getFeatured: async () => {
    try {
      const { data, error} = await supabase
        .from('research_articles')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('publication_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
  },

  // Increment download count
  incrementDownloads: async (articleId) => {
    try {
      await supabase.rpc('increment_research_downloads', { article_id: articleId });
    } catch (error) {
      console.error('Error incrementing downloads:', error);
    }
  }
};

// Blogs API
export const blogsAPI = {
  // Get all published blogs
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get single blog by slug
  getBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;

      // Increment view count
      if (data) {
        await supabase
          .from('blogs')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);
      }

      return data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }
};

export default supabase;