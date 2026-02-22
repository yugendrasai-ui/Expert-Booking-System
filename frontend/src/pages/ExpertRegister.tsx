import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Briefcase, FileText, IndianRupee, Image, Loader2 } from "lucide-react";

const ExpertRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        category: "",
        description: "",
        experience: "",
        price: "",
        profileImage: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data } = await axios.post("http://localhost:5000/api/auth/register-expert", {
                ...formData,
                experience: Number(formData.experience),
                price: Number(formData.price),
            });

            login(data);
            toast({
                title: "Registration Successful",
                description: `Welcome, ${data.name}! Your expert account is created.`,
            });
            navigate("/expert-dashboard");
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Expert Registration
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join our platform and share your expertise.
                    </p>
                </div>
                <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="name"
                                required
                                className="pl-10 h-11"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="email"
                                type="email"
                                required
                                className="pl-10 h-11"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="password"
                                type="password"
                                required
                                className="pl-10 h-11"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="category"
                                required
                                className="pl-10 h-11"
                                placeholder="Domain (e.g. AI/ML, Frontend)"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="description"
                                required
                                className="pl-10 h-11"
                                placeholder="Short Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="experience"
                                type="number"
                                required
                                className="pl-10 h-11"
                                placeholder="Years of Experience"
                                value={formData.experience}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="price"
                                type="number"
                                required
                                className="pl-10 h-11"
                                placeholder="Price per hour"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Image className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="profileImage"
                                required
                                className="pl-10 h-11"
                                placeholder="Profile Image URL"
                                value={formData.profileImage}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                "Register as Expert"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="text-center">
                    <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExpertRegister;
