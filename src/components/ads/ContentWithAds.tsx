'use client';

/**
 * Content With Ads Component - Automatically injects ads into content
 */

import { ReactNode, Children } from 'react';
import { InContentAd } from './InContentAd';

interface ContentWithAdsProps {
  children: ReactNode;
  insertAfter?: number; // How many elements before inserting an ad
  maxAds?: number; // Maximum number of ads to insert
}

export function ContentWithAds({ 
  children, 
  insertAfter = 3,
  maxAds = 2 
}: ContentWithAdsProps) {
  const childArray = Children.toArray(children);
  const result: ReactNode[] = [];
  let adCount = 0;
  
  childArray.forEach((child, index) => {
    result.push(child);
    
    // Insert ad after every 'insertAfter' elements
    if ((index + 1) % insertAfter === 0 && adCount < maxAds) {
      result.push(<InContentAd key={`ad-${index}`} className="my-6" />);
      adCount++;
    }
  });
  
  return <>{result}</>;
}
