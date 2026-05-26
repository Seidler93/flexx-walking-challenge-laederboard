import { formatSteps, getRankLabel } from "../lib/leaderboard";

export function LocationScoreboard({ locations, activeLocationId, onSelect }) {
  return (
    <section className="panel panel--glass">
      <div className="section-heading">
        <p className="eyebrow">Location Leaderboard</p>
        <h2>Highest average steps per person</h2>
      </div>

      <div className="location-list">
        {locations.map((location, index) => {
          const isActive = location.id === activeLocationId;

          return (
            <button
              key={location.id}
              type="button"
              className={`location-card ${isActive ? "is-active" : ""}`}
              onClick={() => onSelect(location.id)}
            >
              <div className="location-card__rank">{getRankLabel(index)}</div>
              <div className="location-card__body">
                <h3>{location.name}</h3>
                <p>{location.participants} participants</p>
              </div>
              <div className="location-card__score">
                {formatSteps(location.averageStepsPerPerson)}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
