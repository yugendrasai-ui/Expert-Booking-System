import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchExpertById } from "@/lib/api";
import type { Expert } from "@/components/ExpertCard";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a session with this expert.",
      });
      navigate("/login");
      return;
    }
    navigate(`/book/${id}`);
  };

  useEffect(() => {
    if (!id) return;

    fetchExpertById(id)
      .then((data) => setExpert(data))
      .catch(() => setExpert(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="text-center py-10">
        Loading...
      </main>
    );
  }

  if (!expert) {
    return (
      <main className="text-center py-10">
        Expert not found
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Experts
      </Button>

      <div className="rounded-xl border bg-card p-8 text-center">

        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <User className="h-10 w-10" />
        </div>

        <h1 className="text-2xl font-bold">
          {expert.name}
        </h1>

        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {expert.description || "Professional consultation and expert guidance."}
        </p>

        <div className="mt-2 flex justify-center gap-3 text-sm text-muted-foreground">
          <span>{expert.category}</span>
          <span>{expert.experience} yrs</span>
          <StarRating rating={expert.rating} />
        </div>

        <Button
          className="mt-6"
          onClick={handleBooking}
        >
          Book a Session
        </Button>

      </div>
    </main>
  );
};

export default ExpertDetail;