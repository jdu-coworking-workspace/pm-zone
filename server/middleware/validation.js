export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      console.error('Validation error:', error);
      console.error('Error issues:', error.issues);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues || error.errors,
      });
    }
  };
};
