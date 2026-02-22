import { useNavigate } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Expert {
  _id: string;
  id?: string;
  name: string;
  category: string;
  experience: number;
  rating: number;
  description?: string;
  profileImage?: string;
}

const ExpertCard = ({ expert }: { expert: Expert }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleViewDetails = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view expert details and book slots.",
      });
      navigate("/login");
      return;
    }
    navigate(`/experts/${expert._id}`);
  };

  return (
    <div className="expert-card flex flex-col">
      {/* Category badge header */}
      <div className="bg-accent/60 px-5 py-3">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {expert.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Avatar & name */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent">
            <User className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-card-foreground">
              {expert.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{expert.experience} yrs experience</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-5">
          <StarRating rating={expert.rating} />
        </div>

        {/* Action */}
        <Button
          onClick={handleViewDetails}
          className="mt-auto w-full"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ExpertCard;
