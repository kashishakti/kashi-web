export function formatDate(dateStr: string) {
  if (dateStr === '') return '';
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function getDayFromDate(dateString: string) {
  if (dateString === '') return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDateTime(dateString: string) {
  if (dateString === '') return { time: '', formattedDate: '' };
  const date = new Date(dateString);

  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return { time, formattedDate };
}