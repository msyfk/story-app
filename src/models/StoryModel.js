import { getAllStories } from "../services/storyApi.js";

export class StoryModel {
  constructor() {
    this.stories = [];
  }

  async getStories() {
    try {
      this.stories = await getAllStories();
      return this.stories;
    } catch (error) {
      console.error("Error in StoryModel.getStories:", error);
      throw error;
    }
  }
}