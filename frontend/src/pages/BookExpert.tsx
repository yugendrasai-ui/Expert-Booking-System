import { useState, useEffect, useCallback } from "react";
import { socket } from "@/lib/socket";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

import {
  ArrowLeft,
  User,
  Briefcase,
  CalendarIcon,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";

import {
  fetchExpertById,
  fetchTimeSlots,
  createBooking,
} from "@/lib/api";

import type { Expert } from "@/components/ExpertCard";
import type { TimeSlot } from "@/lib/api";

/* =========================
   Validation
========================= */

const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

import { useAuth } from "@/context/AuthContext";

/* =========================
   Component
========================= */

const BookExpert = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [expert, setExpert] = useState<Expert | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");

  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [loadingExpert, setLoadingExpert] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     Form
  ========================= */

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      notes: "",
    },
  });

  // Re-fill form if user logs in while on page
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
    }
  }, [user, form]);

  /* =========================
     LOAD EXPERT (FIXED)
  ========================= */

  useEffect(() => {
    if (!expertId) return;

    setLoadingExpert(true);

    fetchExpertById(expertId)
      .then((data) => {
        setExpert(data);
      })
      .catch((err) => {
        console.error(err);
        setExpert(null);
      })
      .finally(() => {
        setLoadingExpert(false);
      });

  }, [expertId]);

  /* =========================
     LOAD SLOTS
  ========================= */

  const loadSlots = useCallback(async () => {
    if (!expertId || !selectedDate) return;

    setLoadingSlots(true);
    setSelectedTime("");

    try {
      const data = await fetchTimeSlots(
        expertId,
        format(selectedDate, "yyyy-MM-dd")
      );

      setSlots(data);
    } catch (err) {
      console.error(err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }

  }, [expertId, selectedDate]);

  useEffect(() => {
    if (selectedDate) loadSlots();
  }, [selectedDate, loadSlots]);

  /* =========================
     LIVE SLOT UPDATE
  ========================= */

  useEffect(() => {
    socket.on("slotUpdated", (data) => {
      if (
        data.expertId === expertId &&
        selectedDate &&
        data.date === format(selectedDate, "yyyy-MM-dd")
      ) {
        setSlots((prev) =>
          prev.map((slot) =>
            slot.time === data.time
              ? { ...slot, available: false }
              : slot
          )
        );
      }
    });

    return () => {
      socket.off("slotUpdated");
    };

  }, [expertId, selectedDate]);

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (values: BookingFormValues) => {
    if (!selectedDate || !selectedTime || !expertId) {
      toast({
        title: "Missing selection",
        description: "Select date and time",
        variant: "destructive",
      });

      return;
    }

    setSubmitting(true);

    try {
      const result = await createBooking({
        expertId,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        name: values.name,
        email: values.email,
        phone: values.phone,
        notes: values.notes,
      }, user?.token);

      if (result.success) {
        socket.emit("slotBooked", {
          expertId,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
        });

        toast({
          title: "Booking Confirmed",
          description: result.message,
        });

        setTimeout(() => navigate("/my-bookings"), 1500);
      } else {
        toast({
          title: "Booking Failed",
          description: result.message || "Something went wrong",
          variant: "destructive",
        });
      }

    } catch (err: any) {
      console.error("Booking error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Booking failed",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loadingExpert) {
    return (
      <main className="text-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
      </main>
    );
  }

  if (!expert) {
    return (
      <main className="text-center py-10">
        <p>Expert not found</p>

        <Button onClick={() => navigate("/")}>
          Back
        </Button>
      </main>
    );
  }

  /* =========================
     DATE LIMIT
  ========================= */

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  /* =========================
     UI
  ========================= */

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">

      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* Expert Info */}
      <div className="border rounded-xl p-6 mb-6">

        <div className="flex gap-4 items-center">

          <div className="h-16 w-16 bg-accent rounded-full flex items-center justify-center">
            <User />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              {expert.name}
            </h1>

            <div className="flex gap-3 text-sm text-muted-foreground">

              <span>{expert.category}</span>

              <span>
                <Briefcase className="inline h-3 w-3" />{" "}
                {expert.experience} yrs
              </span>

              <StarRating rating={expert.rating} />

            </div>
          </div>

        </div>

      </div>

      {/* Date + Time */}
      <div className="border rounded-xl p-6 mb-6">

        <h2 className="font-semibold mb-4 flex gap-2">
          <CalendarIcon /> Select Date & Time
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">

          {/* Date */}
          <div>

            <Popover>
              <PopoverTrigger asChild>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Pick date"}
                </Button>

              </PopoverTrigger>

              <PopoverContent>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(d) => d < tomorrow}
                  modifiers={{
                    booked: (expert as any)?.slots
                      ?.filter((s: any) => s.times.every((t: any) => !t.available))
                      .map((s: any) => new Date(s.date)) || []
                  }}
                  modifiersStyles={{
                    booked: { textDecoration: 'line-through', opacity: 0.5 }
                  }}
                />

              </PopoverContent>
            </Popover>

          </div>

          {/* Slots */}
          <div>

            {!selectedDate ? (
              <p>Select date first</p>

            ) : loadingSlots ? (
              <Loader2 className="animate-spin" />

            ) : slots.length === 0 ? (
              <p>No slots</p>

            ) : (

              <div className="grid grid-cols-3 gap-2">

                {slots.map((slot) => (

                  <Button
                    key={slot.time}
                    size="sm"
                    variant={
                      selectedTime === slot.time
                        ? "default"
                        : "outline"
                    }
                    disabled={!slot.available}
                    onClick={() =>
                      setSelectedTime(slot.time)
                    }
                    className={cn(
                      !slot.available && "line-through opacity-50"
                    )}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {slot.time}
                  </Button>

                ))}

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Form */}
      <div className="border rounded-xl p-6">

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (

                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (

                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (

                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (

                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>

              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                submitting ||
                !selectedDate ||
                !selectedTime
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>

          </form>

        </Form>
      </div>

    </main>
  );
};

export default BookExpert;