import api from './api';

export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string; // mapped from publishedAt
  category: string;
  author: string;
  isPublished: boolean;
}

export interface Event {
  _id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  description: string;
  registrationLink?: string;
}

export const getNews = async (): Promise<{ news: NewsItem[] }> => {
  try {
    const response = await api.get('/api/news');
    // api.ts returns the axio response, we need data
    const news = response.data;

    // Map DB fields to frontend interface
    const mappedNews = news.map((item: any) => ({
      ...item,
      date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
    }));

    return { news: mappedNews };
  } catch (error) {
    console.error('Error fetching news:', error);
    return { news: [] };
  }
};

export const getNewsById = async (idOrSlug: string): Promise<{ news: NewsItem }> => {
  try {
    const response = await api.get(`/api/news/${idOrSlug}`);
    const item = response.data;

    const mappedNews = {
      ...item,
      date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
    };

    return { news: mappedNews };
  } catch (error) {
    console.error('Error fetching news article:', error);
    throw error;
  }
};

// Admin functions
export const getAllAdminNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await api.get('/api/news/admin');
    // The API returns { articles: [...] }, extract the array
    const data = response.data;
    if (data && data.articles) {
      return data.articles;
    }
    // If it's already an array, return as-is
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching admin news:', error);
    return [];
  }
};

export const createNews = async (data: any): Promise<NewsItem> => {
  const response = await api.post('/api/news', data);
  return response.data;
};

export const updateNews = async (id: string, data: any): Promise<NewsItem> => {
  const response = await api.patch(`/api/news/${id}`, data);
  return response.data;
};

export const deleteNews = async (id: string): Promise<void> => {
  await api.delete(`/api/news/${id}`);
};

// Events - Mock data for now
export const getEvents = (): Promise<{ events: Event[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEvents: Event[] = [
        {
          _id: '1',
          name: 'Middle East Construction Expo 2024',
          date: '2024-03-15',
          location: 'Dubai, UAE',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
          description: 'The largest construction equipment trade fair in the Middle East',
          registrationLink: 'https://example.com/register',
        },
        {
          _id: '2',
          name: 'Saudi Industrial Forum',
          date: '2024-04-20',
          location: 'Riyadh, KSA',
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
          description: 'Annual gathering of industry leaders in Saudi Arabia',
          registrationLink: 'https://example.com/register',
        },
      ];

      resolve({ events: mockEvents });
    }, 400);
  });
};
