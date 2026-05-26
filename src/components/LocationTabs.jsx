import { useMemo, useState } from "react";

export function LocationTabs({ locations, activeLocationId, onSelect, allLocationsLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLocation = useMemo(
    () =>
      locations.find((location) => location.id === activeLocationId) ?? {
        id: "all-locations",
        name: allLocationsLabel ?? "All Locations",
      },
    [activeLocationId, allLocationsLabel, locations],
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
            <button
              type="button"
              className={`location-select__option ${
                activeLocationId === "all-locations" ? "is-active" : ""
              }`}
              onClick={() => handleSelect("all-locations")}
            >
              {allLocationsLabel ?? "All Locations"}
            </button>
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
        <button
          type="button"
          role="tab"
          aria-selected={activeLocationId === "all-locations"}
          className={`chip ${activeLocationId === "all-locations" ? "is-active" : ""}`}
          onClick={() => onSelect("all-locations")}
        >
          {allLocationsLabel ?? "All Locations"}
        </button>
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
