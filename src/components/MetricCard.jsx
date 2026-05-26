export function MetricCard({ label, value, detail }) {
  return (
    <div className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}
