import { formatShortDate, formatSteps } from "../lib/leaderboard";

export function TopListCard({ title, items, mode, eyebrow }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <p className="eyebrow">{eyebrow ?? (mode === "steppers" ? "Top 5" : "Best Days")}</p>
        <h3>{title}</h3>
      </div>

      <div className="list-table">
        {items.map((item, index) => (
          <div key={item.id} className="list-row">
            <div className="list-row__rank">#{index + 1}</div>
            <div className="list-row__main">
              <strong>{mode === "steppers" ? item.name : item.participant}</strong>
              <span>
                {item.detail
                  ? item.detail
                  : mode === "steppers"
                    ? `${formatSteps(item.totalSteps)} total steps`
                    : formatShortDate(item.date)}
              </span>
            </div>
            <div className="list-row__value">
              {formatSteps(mode === "steppers" ? item.averageSteps : item.steps)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
