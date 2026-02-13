import React from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder, required }) => (
    <div className="group">
        <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
            {label} {required && <span className="text-purple-400">*</span>}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon size={16} className="text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="
                    w-full pl-10 pr-4 py-3 
                    bg-zinc-900/50 border border-white/10 rounded-xl 
                    text-white placeholder-zinc-600 
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 
                    transition-all duration-200
                "
                placeholder={placeholder}
            />
        </div>
    </div>
);

const Step1Contact = React.forwardRef(({ formData, validationRules, setFormData }, ref) => {
    console.log("Step1Contact rendered");


    const handleBasicInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validate = () => {
        const { fullname, email, phone, linkedin, github, portfolio } = formData;

        if (!validationRules.fullname.validate(fullname)) {
            toast.error(validationRules.fullname.error);
            return false;
        }
        if (!validationRules.email.validate(email)) {
            toast.error(validationRules.email.error);
            return false;
        }
        if (!validationRules.phone.validate(phone)) {
            toast.error(validationRules.phone.error);
            return false;
        }
        if (linkedin && !validationRules.linkedin.validate(linkedin)) {
            toast.error(validationRules.linkedin.error);
            return false;
        }
        if (github && !validationRules.github.validate(github)) {
            toast.error(validationRules.github.error);
            return false;
        }
        if (portfolio && !validationRules.portfolio.validate(portfolio)) {
            toast.error(validationRules.portfolio.error);
            return false;
        }
        return true;
    };

    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    return (
        <div className="animate-fade-up">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                <p className="text-zinc-400 text-sm">How can recruiters reach you?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <InputField
                    label="Full Name"
                    icon={User}
                    value={formData.fullname}
                    onChange={(e) => handleBasicInputChange("fullname", e.target.value)}
                    placeholder="Your Name"
                    required
                />

                <InputField
                    label="Email Address"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => handleBasicInputChange("email", e.target.value)}
                    type="email"
                    placeholder="yourname@example.com"
                    required
                />

                <InputField
                    label="Phone Number"
                    icon={Phone}
                    value={formData.phone}
                    onChange={(e) => handleBasicInputChange("phone", e.target.value)}
                    type="tel"
                    placeholder="1234567890"
                    required
                />

                <InputField
                    label="LinkedIn Profile"
                    icon={Linkedin}
                    value={formData.linkedin}
                    onChange={(e) => handleBasicInputChange("linkedin", e.target.value)}
                    type="url"
                    placeholder="linkedin.com/in/user..."
                />

                <InputField
                    label="GitHub Profile"
                    icon={Github}
                    value={formData.github}
                    onChange={(e) => handleBasicInputChange("github", e.target.value)}
                    type="url"
                    placeholder="github.com/user..."
                />

                <InputField
                    label="Portfolio Website"
                    icon={Globe}
                    value={formData.portfolio}
                    onChange={(e) => handleBasicInputChange("portfolio", e.target.value)}
                    type="url"
                    placeholder="yourportfolio.com"
                />
            </div>
        </div>
    );
});

export default Step1Contact;