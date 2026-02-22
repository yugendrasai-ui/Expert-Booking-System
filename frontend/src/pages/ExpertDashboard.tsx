import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Phone,
    Mail,
    Calendar,
    MessageSquare,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { socket } from "@/lib/socket";

interface Booking {
    _id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    notes: string;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
}

const ExpertDashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        fetchBookings();

        // Use centralized socket from @/lib/socket

        socket.on("connect", () => {
            console.log("Connected to notification socket");
            if (user) {
                socket.emit("join-expert-room", user._id);
            }
        });

        socket.on("new-booking", (booking) => {
            toast({
                title: "New Booking Request!",
                description: `${booking.name} wants to book a slot on ${booking.date} at ${booking.time}`,
            });
            setBookings(prev => [booking, ...prev]);
        });

        // socket cleanup is handled in the lib or if we want to leave it connected
        // return () => {
        //     socket.disconnect();
        // };
    }, [user]);

    const fetchBookings = async () => {
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const { data } = await axios.get(`${apiBase}/bookings/expert-bookings`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setBookings(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch bookings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            await axios.put(`${apiBase}/bookings/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            setBookings(bookings.map(b => b._id === id ? { ...b, status: status as any } : b));

            toast({
                title: `Booking ${status}`,
                description: `Successfully ${status} the booking request.`,
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.response?.data?.message || "Failed to update status",
                variant: "destructive",
            });
        }
    };

    if (loading) return <div className="flex justify-center p-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your incoming booking requests</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Confirmed</p>
                        <p className="text-xl font-bold">{bookings.filter(b => b.status === "confirmed").length}</p>
                    </div>
                    <div className="ml-4 border-l pl-4">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-yellow-600">{bookings.filter(b => b.status === "pending").length}</p>
                    </div>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                    <p className="text-gray-500">Once clients start booking your slots, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${booking.status === "pending" ? "border-yellow-200" : "border-gray-100"
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-grow space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                                                    <p className="text-sm text-gray-500">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                booking.status === "confirmed" ? "default" :
                                                    booking.status === "pending" ? "outline" : "destructive"
                                            } className="capitalize">
                                                {booking.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">{booking.date} at {booking.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-4 w-4" />
                                                <span className="text-sm">{booking.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="h-4 w-4" />
                                                <span className="text-sm">{booking.phone}</span>
                                            </div>
                                        </div>

                                        {booking.notes && (
                                            <div className="bg-gray-50 p-3 rounded-lg flex gap-2">
                                                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                                <p className="text-sm text-gray-600 italic">"{booking.notes}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 justify-end min-w-[120px]">
                                        {booking.status === "pending" && (
                                            <>
                                                <Button
                                                    onClick={() => updateStatus(booking._id, "confirmed")}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    onClick={() => updateStatus(booking._id, "cancelled")}
                                                    variant="outline"
                                                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Decline
                                                </Button>
                                            </>
                                        )}
                                        {booking.status === "confirmed" && (
                                            <Button
                                                disabled
                                                className="w-full bg-gray-100 text-gray-500"
                                            >
                                                Confirmed
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpertDashboard;
