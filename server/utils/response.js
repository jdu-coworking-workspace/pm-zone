export const success = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export const error = (message = 'Error', statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode,
  };
};

export const paginated = (data, page, limit, total) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
