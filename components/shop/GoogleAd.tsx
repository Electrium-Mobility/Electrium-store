'use client';

import { useEffect, useState } from 'react';

type GoogleAdProps = {
  client: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'display' | 'in-article';
  responsive?: boolean;
  className?: string;
};

const GoogleAd = ({
  client = "ca-pub-XXXXXXXXXXXXXXXX",
  slot = "XXXXXXXXXX",
  format = 'auto',
  responsive = true,
  className = '',
}: GoogleAdProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error(err);
      }
    }
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 text-center p-4 ${className}`}
      style={{ display: 'block', minHeight: '250px' }}
    >
      <p className="font-bold">Dummy Ad Banner</p>
      <p className="text-sm">This is a placeholder for Google AdSense</p>
      <p className="text-xs mt-2">Client: {client}</p>
      <p className="text-xs">Slot: {slot}</p>
    </div>
  );
};

export default GoogleAd;

