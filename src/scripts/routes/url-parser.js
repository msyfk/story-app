const getActiveRoute = () => {
  const urlHash = window.location.hash.slice(1).toLowerCase();
  return urlHash || '/';
};

const parseActiveUrlWithCombiner = () => {
  const url = getActiveRoute();
  const splitedUrl = url.split('/');
  return {
    resource: splitedUrl[1] || null,
    id: splitedUrl[2] || null,
    verb: splitedUrl[3] || null,
  };
};

const parseActiveUrlWithoutCombiner = () => {
  const url = getActiveRoute();
  const splitedUrl = url.split('/');
  return {
    resource: splitedUrl[1] || null,
    id: splitedUrl[2] || null,
    verb: splitedUrl[3] || null,
  };
};

export { getActiveRoute, parseActiveUrlWithCombiner, parseActiveUrlWithoutCombiner };
