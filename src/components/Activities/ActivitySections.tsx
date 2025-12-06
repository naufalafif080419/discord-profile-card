'use client';

import React from 'react';
import type { LanyardActivity, LanyardSpotify } from '@/lib/types/lanyard';
import { ActivityCard } from './ActivityCard';
import { SpotifyCard } from './SpotifyCard';

interface ActivitySectionsProps {
  activities: LanyardActivity[];
  listeningActivities: LanyardActivity[];
  spotify: LanyardSpotify | null;
  hideActivity?: boolean;
  hideSpotify?: boolean;
  hideActivityTime?: boolean;
  hideRecentActivity?: boolean;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  userId?: string;
}

function ActivitySectionsComponent({
  activities,
  listeningActivities,
  spotify,
  hideActivity,
  hideSpotify,
  hideActivityTime,
  hideRecentActivity,
  status = 'offline',
  userId,
}: ActivitySectionsProps) {
  const isOffline = status === 'offline';
  
  return (
    <>
      {/* Show activities when online/idle/dnd */}
      {!isOffline && (
        <section
          className={`discord-activities-section ${activities.length > 0 && !hideActivity ? 'has-content' : ''}`}
        >
          <div id="activities-list" className="activities-list">
            {activities.length > 0 && !hideActivity && activities.map((activity, index) => (
              <ActivityCard
                key={activity.id || index}
                activity={activity}
                hideTimestamp={hideActivityTime}
                userId={userId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Show music when online/idle/dnd */}
      {!isOffline && (
        <section
          className={`discord-music-section ${(spotify || listeningActivities.length > 0) && !hideSpotify ? 'has-content' : ''}`}
        >
          <div id="music-list" className="music-list">
            {!hideSpotify && spotify && (
              <SpotifyCard spotify={spotify} />
            )}
            {!hideSpotify && listeningActivities.map((activity, index) => {
              if (activity.name?.toLowerCase().includes('apple')) {
                return <SpotifyCard key={`apple-${index}`} activity={activity} type="apple" />;
              }
              if (activity.name?.toLowerCase().includes('tidal')) {
                return <SpotifyCard key={`tidal-${index}`} activity={activity} type="tidal" />;
              }
              return null;
            })}
          </div>
        </section>
      )}

      {/* Show Recent Activity when offline */}
      {isOffline && !hideRecentActivity && (activities.length > 0 || listeningActivities.length > 0 || spotify) && (
        <section className="discord-recent-activity-section has-content">
          <div className="recent-activity-header">
            <h3 className="recent-activity-title">Recent activity</h3>
          </div>
          <div id="recent-activities-list" className="recent-activities-list">
            {activities.length > 0 && !hideActivity && activities.map((activity, index) => (
              <ActivityCard
                key={activity.id || index}
                activity={activity}
                hideTimestamp={true}
                userId={userId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Show Recent Song when offline */}
      {isOffline && !hideRecentActivity && (spotify || listeningActivities.length > 0) && !hideSpotify && (
        <section className="discord-recent-music-section has-content">
          <div className="recent-music-header">
            <h3 className="recent-music-title">Song</h3>
          </div>
          <div id="recent-music-list" className="recent-music-list">
            {spotify && (
              <SpotifyCard spotify={spotify} hideTimestamp={true} />
            )}
            {listeningActivities.map((activity, index) => {
              if (activity.name?.toLowerCase().includes('apple')) {
                return <SpotifyCard key={`apple-${index}`} activity={activity} type="apple" hideTimestamp={true} />;
              }
              if (activity.name?.toLowerCase().includes('tidal')) {
                return <SpotifyCard key={`tidal-${index}`} activity={activity} type="tidal" hideTimestamp={true} />;
              }
              return null;
            })}
          </div>
        </section>
      )}
    </>
  );
}

const areEqual = (prev: ActivitySectionsProps, next: ActivitySectionsProps): boolean => (
  prev.hideActivity === next.hideActivity &&
  prev.hideSpotify === next.hideSpotify &&
  prev.hideActivityTime === next.hideActivityTime &&
  prev.hideRecentActivity === next.hideRecentActivity &&
  prev.spotify === next.spotify &&
  prev.activities === next.activities &&
  prev.listeningActivities === next.listeningActivities &&
  prev.status === next.status &&
  prev.userId === next.userId
);

export const ActivitySections = React.memo(ActivitySectionsComponent, areEqual);

