import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonPostCard: React.FC = () => {
  return (
    <div className="flex h-40 border border-popover-foreground rounded-lg items-center justify-center p-4">
      <Skeleton width={120} height={120} className="rounded-sm" />
      <div className="ml-4 flex-1">
        <Skeleton width={60} height={20} className="mb-2" />
        <Skeleton width="80%" height={15} />
        <Skeleton width="60%" height={15} className="mt-1" />
        <Skeleton count={2} height={15} className="mt-1" />
        <div className="mt-2 flex items-center text-[12px] text-gray-500">
          <Skeleton width={50} height={15} />
        </div>
      </div>
    </div>
  );
};
