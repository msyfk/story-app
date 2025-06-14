export class StoryPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async getAllStories() {
    try {
      const stories = await this.model.getAllStories();
      this.view.displayStories(stories);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async getStoryDetail(id) {
    try {
      const story = await this.model.getStoryDetail(id);
      this.view.displayStoryDetail(story);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async addStory(description, photo, lat, lon) {
    try {
      await this.model.addStory(description, photo, lat, lon);
      return true;
    } catch (error) {
      this.view.showError(error.message);
      return false;
    }
  }
}