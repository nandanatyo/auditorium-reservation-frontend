export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString();
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString();
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};
