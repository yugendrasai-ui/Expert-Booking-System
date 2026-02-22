import { useState, useEffect, useCallback } from "react";
import SearchFilter from "@/components/SearchFilter";
import ExpertCard from "@/components/ExpertCard";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { fetchExperts, fetchCategories } from "@/lib/api";
import type { Expert } from "@/components/ExpertCard";
import { Users } from "lucide-react";

const LIMIT = 6;

const Index = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load categories once
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const loadExperts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchExperts(page, LIMIT, debouncedSearch, category);
      if (data && data.experts) {
        setExperts(data.experts);
        setTotalPages(data.totalPages || 1);
      } else {
        setError("Received malformed data from server.");
      }
    } catch (err) {
      console.error("Load experts failed:", err);
      setError("Failed to load experts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  if (loading && experts.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadExperts} />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find Your Expert
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
          Browse top professionals across AI/ML, Frontend, Backend, DevOps, and Career coaching. Book a session in minutes.
        </p>
      </section>

      {/* Search & Filter */}
      <section className="mb-8">
        <SearchFilter
          search={search}
          category={category}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />
      </section>

      {/* Content */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-2xl">
            <LoadingSpinner />
          </div>
        )}

        {experts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No experts found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experts.map((expert) => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </section>

            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Index;
