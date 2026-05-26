import { useMemo, useState } from "react";

export function LocationTabs({ locations, activeLocationId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLocation = useMemo(
    () => locations.find((location) => location.id === activeLocationId) ?? locations[0],
    [activeLocationId, locations],
  );

  function handleSelect(locationId) {
    onSelect(locationId);
    setIsOpen(false);
  }

  return (
    <>
      <div className="location-select">
        <span className="location-select__label">Choose location</span>
        <button
          type="button"
          className={`location-select__trigger ${isOpen ? "is-open" : ""}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{activeLocation?.name ?? "Select location"}</span>
          <span className="location-select__chevron" aria-hidden="true">
            ▾
          </span>
        </button>

        {isOpen ? (
          <div className="location-select__menu" role="listbox" aria-label="Choose location">
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                className={`location-select__option ${
                  location.id === activeLocationId ? "is-active" : ""
                }`}
                onClick={() => handleSelect(location.id)}
              >
              {location.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="location-tabs" role="tablist" aria-label="Flexx locations">
        {locations.map((location) => {
          const isActive = location.id === activeLocationId;

          return (
            <button
              key={location.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`chip ${isActive ? "is-active" : ""}`}
              onClick={() => onSelect(location.id)}
            >
              {location.name}
            </button>
          );
        })}
      </div>
    </>
  );
}
