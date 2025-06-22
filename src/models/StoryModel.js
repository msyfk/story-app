import { getAllStories, getStoryDetail } from "../services/storyApi.js";
import { saveStoriesToDB, getStoriesFromDB, getStoryByIdFromDB } from "../utils/indexedDB.js";

export class StoryModel {
  constructor() {
    this.stories = [];
  }

  async getStories() {
    try {
      // Coba ambil dari API terlebih dahulu
      this.stories = await getAllStories();
      
      // Simpan ke IndexedDB untuk penggunaan offline
      await saveStoriesToDB(this.stories);
      
      return this.stories;
    } catch (error) {
      console.error("Error fetching from API, trying IndexedDB:", error);
      
      // Jika gagal, coba ambil dari IndexedDB
      this.stories = await getStoriesFromDB();
      
      if (this.stories.length === 0) {
        throw new Error("Tidak dapat memuat cerita. Periksa koneksi internet Anda.");
      }
      
      return this.stories;
    }
  }
  
  async getStoryById(id) {
    try {
      // Coba ambil dari API terlebih dahulu
      const story = await getStoryDetail(id);
      return story;
    } catch (error) {
      console.error("Error fetching story detail from API, trying IndexedDB:", error);
      
      // Jika gagal, coba ambil dari IndexedDB
      const story = await getStoryByIdFromDB(id);
      
      if (!story) {
        throw new Error("Tidak dapat memuat detail cerita. Periksa koneksi internet Anda.");
      }
      
      return story;
    }
  }
}
