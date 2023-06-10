import axios from 'axios';

class Api {
  constructor() {
    this.baseUrl = 'http://localhost:5500';
  }

  async getAllAnime() {
    try {
      const response = await axios.get(`${this.baseUrl}/getAllAnime`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving all anime:', error);
      return [];
    }
  }

  async getDetailedAnime() {
    try {
      const response = await axios.get(`${this.baseUrl}/getDetailed`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving detailed anime list:', error);
      return [];
    }
  }

  async getTopAnime(page) {
    try {
      const response = await axios.post(`${this.baseUrl}/getTopAnime/:page`, { page });
      return response.data;
    } catch (error) {
      console.error('Error retrieving top anime:', error);
      return [];
    }
  }

  async searchAnime(title) {
    try {
      const response = await axios.post(`${this.baseUrl}/searchAnime`, { title });
      return response.data;
    } catch (error) {
      console.error(`Error searching for anime with title ${title}:`, error);
      return [];
    }
  }

  async addReview(animeid, score, review) {
    try {
      const response = await axios.post(`${this.baseUrl}/addReview`, { animeid, score, review });
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      return null;
    }
  }

  async addAnime(anime) {
    try {
      const response = await axios.post(`${this.baseUrl}/addAnime`, anime);
      return response.data;
    } catch (error) {
      console.error('Error adding anime:', error);
      return null;
    }
  }

  async deleteAnime(animeid) {
    try {
      const response = await axios.post(`${this.baseUrl}/deleteAnime`, { animeid });
      return response.data;
    } catch (error) {
      console.error(`Error deleting anime with ID ${animeid}:`, error);
      return null;
    }
  }

  async getAnimeById(animeid) {
    try {
      const response = await axios.post(`${this.baseUrl}/getAnimeById`, { animeid });
      return response.data;
    } catch (error) {
      console.error(`Error retrieving anime with ID ${animeid}:`, error);
      return null;
    }
  }

  async getReviewById(animeid) {
    try {
      const response = await axios.get(`${this.baseUrl}/getReviewById/${animeid}`);
      return response.data;
    } catch (error) {
      console.error(`Error retrieving reviews for anime with ID ${animeid}:`, error);
      return [];
    }
  }
  

  async getPaginatedAnime(page = 0) {
    try {
      const response = await axios.post(`${this.baseUrl}/getPaginatedAnime`, { page });
      return response.data;
    } catch (error) {
      console.error(`Error retrieving paginated anime for page ${page}:`, error);
      return [];
    }
  }
}

const apiInstance = new Api();

export default apiInstance;
