import { useEffect, useMemo, useState } from "react";
import { LocationScoreboard } from "./components/LocationScoreboard";
import { LocationTabs } from "./components/LocationTabs";
import { MetricCard } from "./components/MetricCard";
import { SetupGuideModal } from "./components/SetupGuideModal";
import { TopListCard } from "./components/TopListCard";
import { useLeaderboardData } from "./hooks/useLeaderboardData";
import {
  formatSteps,
  formatUpdatedAt,
  getSortedLocations,
} from "./lib/leaderboard";

export default function App() {
  const { challenge, locations } = useLeaderboardData();
  const sortedLocations = useMemo(() => getSortedLocations(locations), [locations]);
  const [activeLocationId, setActiveLocationId] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    if (!activeLocationId && sortedLocations.length > 0) {
      setActiveLocationId(sortedLocations[0].id);
    }
  }, [activeLocationId, sortedLocations]);

  const activeLocation =
    sortedLocations.find((location) => location.id === activeLocationId) ??
    sortedLocations[0];

  const totalParticipants = sortedLocations.reduce(
    (sum, location) => sum + location.participants,
    0,
  );

  const challengeAverage =
    totalParticipants > 0
      ? sortedLocations.reduce(
          (sum, location) => sum + location.averageStepsPerPerson * location.participants,
          0,
        ) / totalParticipants
      : 0;

  return (
    <main className="app-shell">
      <section className="hero">
        <img
          src="/flexxLogo.png"
          alt=""
          aria-hidden="true"
          className="hero__watermark"
        />
        <button
          type="button"
          className="hero__help"
          onClick={() => setIsGuideOpen(true)}
          aria-label="Open setup guide"
        >
          ?
        </button>
        <div className="hero__glow hero__glow--left" />
        <div className="hero__glow hero__glow--right" />

        <div className="hero__content">
          <div className="hero__copy">
            <p className="eyebrow">Flexx Personal Training</p>
            <h1>{challenge.title}</h1>
            <p className="hero__subtitle">{challenge.subtitle}</p>

            <div className="status-strip">
              <span>Updated {formatUpdatedAt(challenge.updatedAt)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="overview">
        <MetricCard
          label="Leading gym"
          value={sortedLocations[0]?.name ?? "No data"}
          detail={
            sortedLocations[0]
              ? `${formatSteps(sortedLocations[0].averageStepsPerPerson)} avg steps/person`
              : "Waiting for entries"
          }
        />
        <MetricCard
          label="Across all locations"
          value={formatSteps(challengeAverage)}
          detail="Weighted average steps per person"
        />
        <MetricCard
          label="Total challengers"
          value={formatSteps(totalParticipants)}
          detail="Participants across all 8 gyms"
        />
      </section>

      <LocationScoreboard
        locations={sortedLocations}
        activeLocationId={activeLocation?.id}
        onSelect={setActiveLocationId}
      />

      {activeLocation ? (
        <section className="details panel panel--dark">
          <img
            src="/flexxLogo.png"
            alt=""
            aria-hidden="true"
            className="details__watermark"
          />
          <div className="details__header">
            <div>
              <p className="eyebrow">Location Breakdown</p>
              <h2>{activeLocation.name}</h2>
              <p className="details__summary">
                Top performers by average daily steps and highest single days.
              </p>
            </div>

            <div className="details__pill">
              {formatSteps(activeLocation.averageStepsPerPerson)} avg / person
            </div>
          </div>

          <LocationTabs
            locations={sortedLocations}
            activeLocationId={activeLocation.id}
            onSelect={setActiveLocationId}
          />

          <div className="details__grid">
            <TopListCard
              title="Top 5 Average Steppers"
              items={activeLocation.topAverageSteppers.slice(0, 5)}
              mode="steppers"
            />
            <TopListCard
              title="Top 5 Highest Stepped Days"
              items={activeLocation.topDays.slice(0, 5)}
              mode="days"
            />
          </div>
        </section>
      ) : null}

      <SetupGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </main>
  );
}
