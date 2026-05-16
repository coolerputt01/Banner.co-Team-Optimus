import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  Video,
  CheckCircle2,
  Loader2,
  Megaphone,
  X,
} from "lucide-react";
import { Navigation } from "@/components/navigation/Navigation";

/* ─── Types ─────────────────────────────────────────────────── */
interface FormValues {
  headline: string;
  brandName: string;
  category: string;
  adType: "image" | "video";
  videoUrl: string;
  description: string;
  earningsPerView: number;
  duration: string;
  ageGroups: string[];
  genders: string[];
}

const CATEGORIES = [
  "Fashion",
  "Technology",
  "Food & Drink",
  "Health & Beauty",
  "Entertainment",
  "Finance",
  "Travel",
  "Automotive",
  "Sports",
  "Other",
];

const DURATIONS = ["7 days", "14 days", "30 days", "Custom"];

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];
const GENDER_OPTIONS = ["All", "Male", "Female"];

/* ─── Helpers ────────────────────────────────────────────────── */
function CharCounter({ value, max }: { value: string; max: number }) {
  const pct = value.length / max;
  const color =
    pct >= 0.95
      ? "text-red-500"
      : pct >= 0.8
      ? "text-amber-400"
      : "text-text-sub";
  return (
    <span className={`text-[10px] font-bold tabular-nums ${color}`}>
      {value.length}/{max}
    </span>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[10px] font-black text-text-sub uppercase tracking-widest block mb-2">
      {children}
      {required && <span className="text-primary ml-1">*</span>}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  return msg ? (
    <p className="text-[11px] text-red-500 font-bold mt-1.5">{msg}</p>
  ) : null;
}

/* ─── Component ──────────────────────────────────────────────── */
const CreateAd: React.FC = () => {
  const navigate = useNavigate();
  const [navTab, setNavTab] = useState<"feed" | "wallet" | "inbox" | "profile">("feed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* Media state */
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      headline: "",
      brandName: "",
      category: "",
      adType: "image",
      videoUrl: "",
      description: "",
      earningsPerView: 5,
      duration: "",
      ageGroups: [],
      genders: [],
    },
  });

  const adType = watch("adType");
  const headline = watch("headline");
  const description = watch("description");
  const ageGroups = watch("ageGroups");
  const genders = watch("genders");

  /* ── Media Handlers ── */
  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const toggleChip = (
    field: "ageGroups" | "genders",
    value: string,
    current: string[]
  ) => {
    if (current.includes(value)) {
      setValue(field, current.filter((v) => v !== value), { shouldValidate: true });
    } else {
      setValue(field, [...current, value], { shouldValidate: true });
    }
  };

  /* ── Submit ── */
  const onSubmit = async (_data: FormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/feed");
    }, 2500);
  };

  /* ── Input base classes ── */
  const inputCls =
    "w-full h-14 bg-surface border border-border-subtle rounded-2xl px-4 outline-none transition-all text-text-main text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-text-sub/50";
  const selectCls =
    "w-full h-14 bg-surface border border-border-subtle rounded-2xl px-4 outline-none transition-all text-text-main text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary/30 appearance-none cursor-pointer";

  return (
    <div className="min-h-screen w-full bg-main-bg flex transition-colors">
      <Navigation
        activeTab={navTab}
        onTabChange={(t) => setNavTab(t as typeof navTab)}
        onUpload={() => navigate("/create-ad")}
      />

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-main-bg/95 backdrop-blur-md border-b border-border-subtle px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-text-main" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-text-main italic uppercase tracking-tight leading-tight">
              Create Ad
            </h1>
            <p className="text-[11px] text-text-sub font-bold truncate">
              Reach thousands of engaged users
            </p>
          </div>
          <Megaphone className="h-5 w-5 text-primary shrink-0" />
        </header>

        {/* ── Form ── */}
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-32 lg:pb-12 space-y-5"
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* ── 1. Ad Headline ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel required>Ad Headline</FieldLabel>
                <CharCounter value={headline} max={80} />
              </div>
              <input
                {...register("headline", {
                  required: "Headline is required",
                  maxLength: { value: 80, message: "Max 80 characters" },
                })}
                placeholder="e.g. Discover the best sneakers in Lagos"
                maxLength={80}
                className={inputCls}
              />
              <ErrorMsg msg={errors.headline?.message} />
            </div>

            {/* ── 2. Brand Name ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-2">
              <FieldLabel required>Brand Name</FieldLabel>
              <input
                {...register("brandName", { required: "Brand name is required" })}
                placeholder="e.g. Nike Nigeria"
                className={inputCls}
              />
              <ErrorMsg msg={errors.brandName?.message} />
            </div>

            {/* ── 3. Category ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-2">
              <FieldLabel required>Category</FieldLabel>
              <div className="relative">
                <select
                  {...register("category", { required: "Category is required" })}
                  className={selectCls}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <ErrorMsg msg={errors.category?.message} />
            </div>

            {/* ── 4. Ad Type toggle ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-3">
              <FieldLabel required>Ad Type</FieldLabel>
              <Controller
                name="adType"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    {(["image", "video"] as const).map((type) => {
                      const active = field.value === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => field.onChange(type)}
                          className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase tracking-tight border transition-all ${
                            active
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                              : "bg-main-bg text-text-sub border-border-subtle hover:border-primary/30"
                          }`}
                        >
                          {type === "image" ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : (
                            <Video className="h-4 w-4" />
                          )}
                          {type === "image" ? "Image Ad" : "Video Ad"}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* ── 5. Media Upload ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-3">
              <FieldLabel required>
                {adType === "image" ? "Upload Image" : "Video & Thumbnail"}
              </FieldLabel>

              {adType === "image" ? (
                <>
                  {/* Drag-and-drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : "border-border-subtle hover:border-primary/50 hover:bg-primary/5"
                    }`}
                    style={{ minHeight: 160 }}
                  >
                    {mediaPreview ? (
                      <div className="relative">
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full max-h-64 object-cover rounded-2xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMediaPreview(null); }}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-text-main">
                            Drag & drop or{" "}
                            <span className="text-primary underline">browse</span>
                          </p>
                          <p className="text-[11px] text-text-sub font-bold mt-1">
                            JPG, PNG or WebP · Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {/* Video URL */}
                  <input
                    {...register("videoUrl", {
                      validate: (v) =>
                        adType !== "video" || !!v || "Video URL is required",
                    })}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inputCls}
                  />
                  <ErrorMsg msg={errors.videoUrl?.message} />

                  {/* Thumbnail upload */}
                  <div
                    onClick={() => thumbInputRef.current?.click()}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-border-subtle hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
                    style={{ minHeight: 120 }}
                  >
                    {thumbPreview ? (
                      <div className="relative">
                        <img
                          src={thumbPreview}
                          alt="Thumbnail"
                          className="w-full max-h-48 object-cover rounded-2xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setThumbPreview(null); }}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <ImageIcon className="h-6 w-6 text-text-sub" />
                        <p className="text-[11px] text-text-sub font-bold">
                          Upload thumbnail image
                        </p>
                      </div>
                    )}
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setThumbPreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── 6. Description ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>Ad Description</FieldLabel>
                <CharCounter value={description} max={200} />
              </div>
              <textarea
                {...register("description", {
                  maxLength: { value: 200, message: "Max 200 characters" },
                })}
                placeholder="Tell viewers what makes your brand special..."
                maxLength={200}
                rows={4}
                className="w-full bg-main-bg border border-border-subtle rounded-2xl px-4 py-3 outline-none transition-all text-text-main text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-text-sub/50 resize-none"
              />
              <ErrorMsg msg={errors.description?.message} />
            </div>

            {/* ── 7. Earnings Per View ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-2">
              <FieldLabel required>Earnings Per View</FieldLabel>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-primary">
                  ₦
                </span>
                <input
                  type="number"
                  {...register("earningsPerView", {
                    required: "Earnings per view is required",
                    min: { value: 1, message: "Minimum is ₦1" },
                    max: { value: 50, message: "Maximum is ₦50" },
                  })}
                  min={1}
                  max={50}
                  className={`${inputCls} pl-8`}
                  placeholder="5"
                />
              </div>
              <p className="text-[11px] text-text-sub font-bold">
                Amount users earn for watching your ad · Min ₦1, Max ₦50
              </p>
              <ErrorMsg msg={errors.earningsPerView?.message} />
            </div>

            {/* ── 8. Campaign Duration ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-3">
              <FieldLabel required>Campaign Duration</FieldLabel>
              <Controller
                name="duration"
                control={control}
                rules={{ required: "Select a duration" }}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {DURATIONS.map((d) => {
                      const active = field.value === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => field.onChange(d)}
                          className={`h-12 rounded-2xl text-xs font-black uppercase tracking-tight border transition-all ${
                            active
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                              : "bg-main-bg text-text-sub border-border-subtle hover:border-primary/30"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <ErrorMsg msg={errors.duration?.message} />
            </div>

            {/* ── 9. Target Audience ── */}
            <div className="bg-surface rounded-3xl border border-border-subtle p-5 space-y-4">
              <FieldLabel>Target Audience</FieldLabel>

              {/* Age Groups */}
              <div className="space-y-2">
                <p className="text-[10px] text-text-sub font-bold uppercase tracking-wider">
                  Age Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {AGE_GROUPS.map((age) => {
                    const active = ageGroups.includes(age);
                    return (
                      <button
                        key={age}
                        type="button"
                        onClick={() => toggleChip("ageGroups", age, ageGroups)}
                        className={`h-9 px-4 rounded-full text-xs font-black border transition-all ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-main-bg text-text-sub border-border-subtle hover:border-primary/30"
                        }`}
                      >
                        {age}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <p className="text-[10px] text-text-sub font-bold uppercase tracking-wider">
                  Gender
                </p>
                <div className="flex flex-wrap gap-2">
                  {GENDER_OPTIONS.map((g) => {
                    const active = genders.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleChip("genders", g, genders)}
                        className={`h-9 px-4 rounded-full text-xs font-black border transition-all ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-main-bg text-text-sub border-border-subtle hover:border-primary/30"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="relative w-full h-14 group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className={`absolute inset-0 rounded-2xl translate-x-1 translate-y-1 transition-transform ${
                  isValid && !isSubmitting
                    ? "bg-primary group-hover:translate-x-1.5 group-hover:translate-y-1.5"
                    : "bg-slate-400"
                }`}
              />
              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center gap-2 border border-transparent active:scale-[0.98] transition-all ${
                  isValid && !isSubmitting
                    ? "bg-text-primary dark:bg-white"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-main-bg dark:text-black" />
                    <span className="text-main-bg dark:text-black font-black text-sm tracking-tight uppercase">
                      Submitting...
                    </span>
                  </>
                ) : (
                  <span className="text-main-bg dark:text-black font-black text-sm tracking-tight uppercase">
                    Submit Ad for Review
                  </span>
                )}
              </div>
            </button>
          </form>
        </motion.main>
      </div>

      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="bg-surface rounded-3xl border border-border-subtle p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight mb-2">
                Ad Submitted!
              </h2>
              <p className="text-sm text-text-sub font-bold leading-relaxed">
                Your ad has been submitted for review. We'll get back to you within{" "}
                <span className="text-primary">24 hours</span>.
              </p>
              <div className="mt-6 h-1 w-full bg-border-subtle rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.4, ease: "linear" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateAd;
