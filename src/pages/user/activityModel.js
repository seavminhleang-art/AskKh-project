export function monthlyActivity(events, now = new Date()) {
  const countMonth = offset => {
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
    return events.filter(event => {
      const date = new Date(event.date);
      return date >= start && date < end && date <= now;
    });
  };
  const current = countMonth(0);
  const previous = countMonth(-1);
  const buckets = items => Array.from({ length: 5 }, (_, index) => items.filter(item => Math.min(4, Math.floor((new Date(item.date).getDate() - 1) / 7)) === index).length);
  const days = new Map();
  current.forEach(item => { const key = new Date(item.date).toLocaleDateString('en-CA'); days.set(key, (days.get(key) || 0) + 1); });
  const bestDay = [...days].sort((a, b) => b[1] - a[1])[0];
  return { current, previous, thisMonth: buckets(current), lastMonth: buckets(previous), bestDay };
}
