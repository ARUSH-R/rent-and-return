import { useState, useEffect, useRef } from "react";

/**
 * Generic data fetching hook for GET requests.
 * Usage: const { data, loading, error } = useFetch("/api/items");
 * @param {string} url - The endpoint to fetch.
 * @param {object} options - Fetch options (optional).
 * @param {array} deps - Dependency array to control refetch (optional).
 */
const useFetch = (url, options = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    fetch(url, { ...options, signal: abortController.signal })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || res.statusText);
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Fetch error");
      })
      .finally(() => setLoading(false));

    return () => abortController.abort();
    // eslint-disable-next-line
  }, [url, ...deps]);

  return { data, loading, error };
};

export default useFetch;