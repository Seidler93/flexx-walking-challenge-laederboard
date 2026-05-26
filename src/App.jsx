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

const ALL_LOCATIONS_ID = "all-locations";

export default function App() {
  const { challenge, locations } = useLeaderboardData();
  const sortedLocations = useMemo(() => getSortedLocations(locations), [locations]);
  const [activeLocationId, setActiveLocationId] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    if (!activeLocationId && sortedLocations.length > 0) {
      setActiveLocationId(ALL_LOCATIONS_ID);
    }
  }, [activeLocationId, sortedLocations]);

  const activeLocation =
    sortedLocations.find((location) => location.id === activeLocationId) ??
    null;

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

  const overallAverageSteppers = useMemo(
    () =>
      sortedLocations
        .flatMap((location) =>
          (location.topAverageSteppers ?? []).map((participant) => ({
            ...participant,
            detail: `${location.name} • ${formatSteps(participant.totalSteps)} total steps`,
          })),
        )
        .sort((left, right) => right.averageSteps - left.averageSteps)
        .slice(0, 10),
    [sortedLocations],
  );

  const overallTopDays = useMemo(
    () =>
      sortedLocations
        .flatMap((location) =>
          (location.topDays ?? []).map((day) => ({
            ...day,
            detail: `${location.name} • ${new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(new Date(day.date))}`,
          })),
        )
        .sort((left, right) => right.steps - left.steps)
        .slice(0, 10),
    [sortedLocations],
  );

  const isAllLocationsView = activeLocationId === ALL_LOCATIONS_ID || !activeLocation;

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
        activeLocationId={isAllLocationsView ? undefined : activeLocation?.id}
        onSelect={setActiveLocationId}
      />

      {sortedLocations.length > 0 ? (
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
              <h2>{isAllLocationsView ? "All Locations" : activeLocation.name}</h2>
              <p className="details__summary">
                {isAllLocationsView
                  ? "Overall top performers across every Flexx location."
                  : "Top performers by average daily steps and highest single days."}
              </p>
            </div>

            <div className="details__pill">
              {formatSteps(
                isAllLocationsView
                  ? challengeAverage
                  : activeLocation.averageStepsPerPerson,
              )}{" "}
              avg / person
            </div>
          </div>

          <LocationTabs
            locations={sortedLocations}
            activeLocationId={isAllLocationsView ? ALL_LOCATIONS_ID : activeLocation.id}
            onSelect={setActiveLocationId}
            allLocationsLabel="All Locations"
          />

          <div className="details__grid">
            <TopListCard
              title={isAllLocationsView ? "Top 10 Walkers Overall" : "Top 5 Average Steppers"}
              items={
                isAllLocationsView
                  ? overallAverageSteppers
                  : activeLocation.topAverageSteppers.slice(0, 5)
              }
              mode="steppers"
              eyebrow={isAllLocationsView ? "Overall Top 10" : "Top 5"}
            />
            <TopListCard
              title={
                isAllLocationsView ? "Top 10 Highest Walked Days" : "Top 5 Highest Stepped Days"
              }
              items={isAllLocationsView ? overallTopDays : activeLocation.topDays.slice(0, 5)}
              mode="days"
              eyebrow={isAllLocationsView ? "Overall Top 10" : "Best Days"}
            />
          </div>
        </section>
      ) : null}

      <SetupGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </main>
  );
}
