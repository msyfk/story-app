import Home from '../pages/home/home';
import About from '../pages/about/about';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import AddStory from '../pages/addStory/addStory';
import StoryDetail from '../pages/storyDetail/storyDetail';
import { parseActiveUrlWithoutCombiner } from './url-parser';

const routes = {
  '/': () => new Home(),
  '/home': () => new Home(),
  '/about': () => new About(),
  '/login': () => new Login(),
  '/register': () => new Register(),
  '/addstory': () => new AddStory(),
  '/logout': () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.hash = '#/login';
    return new Login();
  },
};

// Function to get the appropriate route handler
const getRouteHandler = (url) => {
  // Check for exact matches first
  if (routes[url]) {
    return routes[url];
  }

  // Check for story detail route pattern
  const urlParts = parseActiveUrlWithoutCombiner();
  if (urlParts.resource === 'story' && urlParts.id) {
    return () => new StoryDetail();
  }

  return null;
};

export default routes;
export { getRouteHandler };
