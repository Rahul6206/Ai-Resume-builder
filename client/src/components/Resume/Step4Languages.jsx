import React from 'react';
import { toast } from 'react-toastify';
import { Plus, X, Globe, Heart } from '../../icons';

const SimpleInputList = ({
    title,
    subtitle,
    icon: Icon,
    items,
    fieldName,
    placeholder,
    colorClass,
    handleArrayInputChange,
    removeArrayItem,
    setFormData
}) => (
    <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                    <Icon size={24} className={colorClass.replace("bg-", "text-")} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, [fieldName]: [...prev[fieldName], ""] }))}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all hover:border-purple-500/30"
            >
                <Plus size={14} /> Add
            </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, idx) => (
                <div key={idx} className="relative group">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(fieldName, idx, "", e.target.value)}
                        className="
                            w-full pl-4 pr-10 py-3 
                            bg-black/40 border border-white/10 rounded-xl 
                            text-white placeholder-zinc-600 
                            focus:outline-none focus:border-purple-500/50 focus:bg-zinc-900/50 
                            transition-all
                        "
                        placeholder={placeholder}
                    />
                    {items.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeArrayItem(fieldName, idx)}
                            className="absolute right-2 top-2.5 text-zinc-600 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const Step4Languages = React.forwardRef(({ formData, handleArrayInputChange, removeArrayItem, validationRules, setFormData }, ref) => {

    const validate = () => {
        const validLanguages = formData.languages.filter(l => l.trim().length > 0);
        const validInterests = formData.interests.filter(i => i.trim().length > 0);

        for (let lang of validLanguages) {
            if (!validationRules.language.validate(lang)) {
                toast.error(`Language: ${validationRules.language.error}`);
                return false;
            }
        }
        for (let interest of validInterests) {
            if (!validationRules.interest.validate(interest)) {
                toast.error(`Interest: ${validationRules.interest.error}`);
                return false;
            }
        }
        return true;
    };

    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Final Details</h2>
                <p className="text-zinc-400 text-sm">Add languages you speak and your personal interests.</p>
            </div>

            <SimpleInputList
                title="Languages"
                subtitle="What languages are you proficient in?"
                icon={Globe}
                items={formData.languages}
                fieldName="languages"
                placeholder="e.g. English (Native)"
                colorClass="bg-cyan-500 text-cyan-400"
                handleArrayInputChange={handleArrayInputChange}
                removeArrayItem={removeArrayItem}
                setFormData={setFormData}
            />

            <SimpleInputList
                title="Interests"
                subtitle="Hobbies that define your personality."
                icon={Heart}
                items={formData.interests}
                fieldName="interests"
                placeholder="e.g. Hiking, Photography"
                colorClass="bg-pink-500 text-pink-400"
                handleArrayInputChange={handleArrayInputChange}
                removeArrayItem={removeArrayItem}
                setFormData={setFormData}
            />
        </div>
    );
});

export default Step4Languages;
