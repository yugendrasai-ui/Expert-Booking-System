import { useState, useEffect } from "react";
import { fetchMyBookings } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, User, AlertCircle } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchMyBookings(user!.token);
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="text-primary h-8 w-8" /> My Bookings
        </h1>
        <Badge variant="outline" className="px-3 py-1">
          {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
        </Badge>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b: any) => (
            <div
              key={b._id}
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${b.status === "confirmed" ? "bg-green-500" :
                  b.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                }`} />

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                      {b.expertId?.name || "Expert"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {b.expertId?.category || "Consultant"}
                    </p>
                  </div>
                </div>
                <Badge className={`capitalize ${b.status === "confirmed" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                    b.status === "pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                      "bg-red-100 text-red-700 hover:bg-red-200"
                  } border-none shadow-none`}>
                  {b.status}
                </Badge>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-900">{b.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded-md">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-900">{b.time}</span>
                </div>
              </div>

              {b.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 italic truncate">
                    " {b.notes} "
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h2>
          <p className="text-gray-500 max-w-xs mx-auto">
            You haven't made any bookings yet. Start by exploring our experts!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;