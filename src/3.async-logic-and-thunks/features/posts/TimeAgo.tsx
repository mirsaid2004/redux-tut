import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function TimeAgo({ timestamp }: { timestamp: string }) {
  const timeAgo = dayjs(timestamp).fromNow();
  return <div>{timeAgo}</div>;
}

export default TimeAgo;
