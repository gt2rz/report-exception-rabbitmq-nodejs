export const trazabilityMiddleware = async (message: string, next: Function) => {
  const msgJson = JSON.parse(message);
  const msgProcessed = {
    ...msgJson,
    trazability: {
      timestamp: new Date().toISOString(),
      service: 'report-exception',
      version: '1.0.0',
    },
  };

  await next(msgProcessed);
};
