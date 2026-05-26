import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { sampleChallenge } from "../data/sampleData";

function normalizeLocation(doc) {
  const data = doc.data();

  return {
    id: doc.id,
    name: data.name ?? doc.id,
    accent: data.accent ?? "north",
    participants: data.participants ?? 0,
    averageStepsPerPerson: data.averageStepsPerPerson ?? 0,
    topAverageSteppers: data.topAverageSteppers ?? [],
    topDays: data.topDays ?? [],
    updatedAt: data.updatedAt ?? null,
  };
}

function getLatestUpdatedAt(locations) {
  const timestamps = locations
    .map((location) => location.updatedAt)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return sampleChallenge.challenge.updatedAt;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

export function useLeaderboardData() {
  const [state, setState] = useState({
    challenge: sampleChallenge.challenge,
    locations: sampleChallenge.locations,
    source: isFirebaseConfigured ? "firebase" : "sample",
    loading: isFirebaseConfigured,
    error: null,
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, "locations"),
      (snapshot) => {
        const locations = snapshot.docs.map(normalizeLocation);
        const activeLocations =
          locations.length > 0 ? locations : sampleChallenge.locations;

        setState((current) => ({
          ...current,
          challenge: {
            ...current.challenge,
            updatedAt: getLatestUpdatedAt(activeLocations),
          },
          locations: activeLocations,
          source: locations.length > 0 ? "firebase" : "sample",
          loading: false,
          error: null,
        }));
      },
      (error) => {
        setState((current) => ({
          ...current,
          loading: false,
          error,
          source: "sample",
          locations: sampleChallenge.locations,
        }));
      },
    );

    return unsubscribe;
  }, []);

  return state;
}
