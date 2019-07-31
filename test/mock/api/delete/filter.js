const filter = {
  path: '/filters/:id',
  method: 'DELETE',
  cache: false,
  status: (req, res, next) => {
    if (req.params.id === '1024') {
      // already deleted
      res.status(404);
    } else {
      res.status(204);
    }

    next();
  },
};

export default [filter];
