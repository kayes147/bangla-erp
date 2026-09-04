"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  LogOut, 
  ChevronDown, 
  Building2, 
  ShieldCheck, 
  Menu, 
  Bell, 
  Camera, 
  Pencil, 
  X, 
  Save, 
  Trash2, 
  Loader2,
  Phone,
  MapPin,
  UserCheck,
  Plus,
  KeyRound,
  User,
  Check
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import BengaliClock from "./BengaliClock";
import { compressImageFile } from "@/lib/imageUtils";
import { 
  getBusinessProfile, 
  updateBusinessProfile, 
  getUserProfile, 
  updateUserProfilePhoto,
  getCompanyManagers,
  saveCompanyManager,
  updateManagerPhoto
} from "@/actions/profileActions";

export default function TopNav({
  onToggleMobileMenu,
  hasNotifications = false,
}: {
  onToggleMobileMenu?: () => void;
  hasNotifications?: boolean;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userName = session?.user?.name || "Owner";
  const userRole = (session?.user as any)?.role || "OWNER";
  const userEmail = session?.user?.email || "bolaka@erp.com";

  // Photo & Business Profile State
  const [userImage, setUserImage] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<any>({
    companyName: "BOLAKA FACTORY",
    phone: "01954223347",
    address: "ঢাকা, বাংলাদেশ",
    logo: null,
  });

  // User Profile Photo Modal
  const [isUserPhotoModalOpen, setIsUserPhotoModalOpen] = useState(false);
  const [previewUserPhoto, setPreviewUserPhoto] = useState<string | null>(null);
  const [isSavingUserPhoto, setIsSavingUserPhoto] = useState(false);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);

  // Business Company & Manager Profile Modal
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [bizModalTab, setBizModalTab] = useState<"company" | "manager">("company");
  const [bizName, setBizName] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizLogo, setBizLogo] = useState<string | null>(null);
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const bizLogoInputRef = useRef<HTMLInputElement>(null);

  // Manager state in modal
  const [managersList, setManagersList] = useState<any[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null);
  const [mgrUsername, setMgrUsername] = useState("");
  const [mgrPassword, setMgrPassword] = useState("");
  const [mgrImage, setMgrImage] = useState<string | null>(null);
  const [isSavingManager, setIsSavingManager] = useState(false);

  // Load User and Business Profile on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [uRes, bRes] = await Promise.all([
          getUserProfile(userName),
          getBusinessProfile(),
        ]);

        if (mounted) {
          if (uRes.success && uRes.user?.image) {
            setUserImage(uRes.user.image);
          }
          if (bRes.success && bRes.profile) {
            setBusinessProfile(bRes.profile);
            try {
              localStorage.setItem("erp_business_logo", bRes.profile.logo || "");
              localStorage.setItem("erp_business_name", bRes.profile.companyName || "BOLAKA FACTORY");
              localStorage.setItem("erp_business_phone", bRes.profile.phone || "");
              localStorage.setItem("erp_business_address", bRes.profile.address || "");
              window.dispatchEvent(new Event("businessProfileUpdated"));
            } catch (e) {
              // ignore
            }
          }
        }
      } catch (err) {
        // ignore
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [userName]);

  const fetchManagers = async () => {
    setIsLoadingManagers(true);
    try {
      const res = await getCompanyManagers();
      if (res.success && res.managers) {
        setManagersList(res.managers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingManagers(false);
    }
  };

  const openUserPhotoModal = () => {
    setPreviewUserPhoto(userImage);
    setIsUserPhotoModalOpen(true);
    setIsProfileOpen(false);
  };

  const openBusinessModal = (tab: "company" | "manager" = "company") => {
    setBizName(businessProfile?.companyName || "BOLAKA FACTORY");
    setBizPhone(businessProfile?.phone || "");
    setBizAddress(businessProfile?.address || "");
    setBizLogo(businessProfile?.logo || null);
    setBizModalTab(tab);
    setIsAddingManager(false);
    setEditingManagerId(null);
    setMgrUsername("");
    setMgrPassword("");
    setMgrImage(null);
    setIsBusinessModalOpen(true);
    setIsProfileOpen(false);
    fetchManagers();
  };

  const handleUpdateManagerPhotoDirect = async (managerIdOrUsername: string, file: File) => {
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.82);
      const res = await updateManagerPhoto(managerIdOrUsername, compressed);
      if (res.success) {
        setManagersList((prev) =>
          prev.map((m) =>
            m.id === managerIdOrUsername || m.username === managerIdOrUsername
              ? { ...m, image: compressed }
              : m
          )
        );
      } else {
        alert(res.error || "ম্যানেজারের ছবি আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      alert(err.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে");
    }
  };

  const handleSaveManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mgrUsername.trim()) {
      alert("ম্যানেজার ইউজারনেম দিন!");
      return;
    }
    if (!editingManagerId && (!mgrPassword || mgrPassword.length < 3)) {
      alert("ম্যানেজারের জন্য ন্যূনতম ৩ অক্ষরের পাসওয়ার্ড দিন!");
      return;
    }

    setIsSavingManager(true);
    try {
      const res = await saveCompanyManager({
        id: editingManagerId || undefined,
        username: mgrUsername.trim(),
        password: mgrPassword.trim() || undefined,
        image: mgrImage,
      });

      if (res.success) {
        await fetchManagers();
        setIsAddingManager(false);
        setEditingManagerId(null);
        setMgrUsername("");
        setMgrPassword("");
        setMgrImage(null);
        alert("ম্যানেজার সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        alert(res.error || "ম্যানেজার সংরক্ষণ করতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      alert(err.message || "একটি ত্রুটি ঘটেছে!");
    } finally {
      setIsSavingManager(false);
    }
  };

  const handleUserPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setPreviewUserPhoto(compressed);
    } catch (err: any) {
      alert(err.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে");
    }
  };

  const handleSaveUserPhoto = async () => {
    setIsSavingUserPhoto(true);
    try {
      const res = await updateUserProfilePhoto(userName, previewUserPhoto);
      if (res.success) {
        setUserImage(previewUserPhoto);
        setIsUserPhotoModalOpen(false);
        router.refresh();
      } else {
        alert(res.error || "প্রোফাইল ছবি সেভ করতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      alert(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsSavingUserPhoto(false);
    }
  };

  const handleBizLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setBizLogo(compressed);
    } catch (err: any) {
      alert(err.message || "লোগো আপলোড করতে সমস্যা হয়েছে");
    }
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBiz(true);
    try {
      const res = await updateBusinessProfile({
        companyName: bizName.trim() || "BOLAKA FACTORY",
        phone: bizPhone.trim() || null,
        address: bizAddress.trim() || null,
        logo: bizLogo,
      });

      if (res.success && res.profile) {
        setBusinessProfile(res.profile);
        try {
          localStorage.setItem("erp_business_logo", res.profile.logo || "");
          localStorage.setItem("erp_business_name", res.profile.companyName || "BOLAKA FACTORY");
          localStorage.setItem("erp_business_phone", res.profile.phone || "");
          localStorage.setItem("erp_business_address", res.profile.address || "");
          window.dispatchEvent(new Event("businessProfileUpdated"));
        } catch (e) {
          // ignore
        }
        setIsBusinessModalOpen(false);
        router.refresh();
      } else {
        alert(res.error || "কোম্পানি প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      alert(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsSavingBiz(false);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/") return { bn: "ড্যাশবোর্ড ওভারভিউ", en: "Overview" };
    if (pathname.startsWith("/product-in")) return { bn: "পণ্য ইন", en: "Product In" };
    if (pathname.startsWith("/product-out")) return { bn: "পণ্য আউট", en: "Product Out" };
    if (pathname.startsWith("/main-cash")) return { bn: "মূল ক্যাশ", en: "Main Cash" };
    if (pathname.startsWith("/expenses")) return { bn: "দৈনিক খরচ", en: "Daily Expense" };
    if (pathname.startsWith("/loan")) return { bn: "বকেয়ার হিসাব", en: "Business Due" };
    if (pathname.startsWith("/clients")) return { bn: "প্রতিষ্ঠান", en: "Company" };
    if (pathname.startsWith("/salary") || pathname.startsWith("/hr")) return { bn: "কর্মী", en: "Employees" };
    if (pathname.startsWith("/approvals")) return { bn: "অনুমোদন তালিকা", en: "Approvals" };
    if (pathname.startsWith("/audit-logs")) return { bn: "অডিট লগ", en: "Audit Logs" };
    if (pathname.startsWith("/notifications")) return { bn: "নোটিফিকেশন", en: "Notifications" };
    if (pathname.startsWith("/portal/dashboard")) return { bn: "প্রতিষ্ঠান ড্যাশবোর্ড", en: "Dashboard" };
    if (pathname.startsWith("/portal/product-in")) return { bn: "প্রাপ্ত পণ্য", en: "Received" };
    if (pathname.startsWith("/portal/product-out")) return { bn: "পণ্য আউট ফর্ম", en: "Send Request" };
    return { bn: "বাংলা ইআরপি", en: "Bangla ERP" };
  };

  const currentTitle = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 sm:px-6 z-40 gap-2 sm:gap-3 relative shrink-0">
      {/* Left: Mobile Hamburger Button & Active Page Name */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
            title="মেনু খুলুন"
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <span className="text-sm sm:text-base font-bold text-gray-800 truncate max-w-[110px] xs:max-w-[140px] sm:max-w-none">
          {currentTitle.bn} <span className="text-xs font-normal text-gray-400 hidden lg:inline">({currentTitle.en})</span>
        </span>
      </div>

      {/* Center: Live Bengali Date & Digital Clock */}
      <div className="flex items-center justify-center shrink-0">
        <BengaliClock />
      </div>

      {/* Right: Notifications Bell & Clickable User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Notification Bell Button */}
        <Link
          href="/notifications"
          prefetch={false}
          className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-all relative active:scale-95 ${
            pathname.startsWith("/notifications")
              ? "bg-purple-100 border-purple-300 text-purple-700"
              : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900"
          }`}
          title="নোটিফিকেশন দেখুন"
        >
          <Bell size={18} />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </Link>

        {/* User Profile Button with Photo */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0 border border-gray-200">
              {userImage ? (
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.charAt(0)
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-gray-900 capitalize leading-tight">
                {userName}
              </p>
              <span
                className={`inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                  userRole === "OWNER"
                    ? "bg-amber-100 text-amber-800"
                    : userRole === "MANAGER"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {userRole === "OWNER" ? "মালিক" : userRole === "MANAGER" ? "ম্যানেজার" : "প্রতিষ্ঠান"}
              </span>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Details Dropdown Menu */}
          {isProfileOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)}
              />

              <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Identity Header with Change Photo Option */}
                <div className="px-4 py-3 border-b border-gray-100 bg-slate-50/60">
                  <div className="flex items-center space-x-3">
                    <div className="relative group shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm border border-gray-200">
                        {userImage ? (
                          <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          userName.charAt(0)
                        )}
                      </div>
                      <button
                        onClick={openUserPhotoModal}
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer"
                        title="প্রোফাইল ছবি পরিবর্তন করুন"
                      >
                        <Camera size={10} />
                      </button>
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                      <button
                        onClick={openUserPhotoModal}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline mt-0.5 cursor-pointer flex items-center gap-1"
                      >
                        <Camera size={11} />
                        <span>ছবি পরিবর্তন</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">
                      {userRole === "OWNER" ? "মালিক (Owner)" : userRole === "MANAGER" ? "ম্যানেজার (Manager)" : "প্রতিষ্ঠান (Company)"}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>সক্রিয়</span>
                    </span>
                  </div>
                </div>

                {/* Owner Company Info with Edit Option */}
                <div className="px-4 py-3 text-xs border-b border-gray-100 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                        {businessProfile?.logo ? (
                          <img src={businessProfile.logo} alt="Company Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={16} className="text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-extrabold text-gray-900 block leading-tight">
                          {businessProfile?.companyName || "BOLAKA FACTORY"}
                        </span>
                        <span className="text-[10px] text-gray-400">মালিক কোম্পানি (Owner Business)</span>
                      </div>
                    </div>
                    {userRole === "OWNER" && (
                      <button
                        onClick={() => openBusinessModal("company")}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="কোম্পানি লোগো ও তথ্য এডিট করুন"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  </div>

                  {userRole === "OWNER" && (
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-gray-100">
                      <button
                        onClick={() => openBusinessModal("manager")}
                        className="flex-1 py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserCheck size={13} className="text-amber-600" />
                        <span>ম্যানেজার প্রোফাইল ও ফটো</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Logout Option */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      try {
                        localStorage.removeItem("erp_remember_me");
                        sessionStorage.clear();
                        document.cookie = "erp_session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                      } catch (e) {
                        console.warn("Storage clear error:", e);
                      }
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>লগআউট (Log Out)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 1. USER PROFILE PHOTO MODAL */}
      {isUserPhotoModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Camera size={18} className="text-blue-400" />
                <h3 className="font-bold text-base">
                  {userRole === "OWNER" ? "মালিক প্রোফাইল ছবি" : userRole === "MANAGER" ? "ম্যানেজার প্রোফাইল ছবি" : "প্রোফাইল ছবি"}
                </h3>
              </div>
              <button
                onClick={() => setIsUserPhotoModalOpen(false)}
                disabled={isSavingUserPhoto}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 text-center">
              {/* Photo Preview Circle */}
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden bg-slate-100 border-4 border-indigo-100 shadow-md flex items-center justify-center group">
                {previewUserPhoto ? (
                  <img src={previewUserPhoto} alt="User Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold uppercase">
                    {userName.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  আপনার অ্যাকাউন্টের জন্য স্পষ্ট একটি প্রোফাইল ছবি আপলোড করুন।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => userPhotoInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Camera size={14} />
                  <span>{previewUserPhoto ? "নতুন ছবি পছন্দ করুন" : "ছবি পছন্দ করুন"}</span>
                </button>
                {previewUserPhoto && (
                  <button
                    type="button"
                    onClick={() => setPreviewUserPhoto(null)}
                    className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                    title="ছবি মুছে ফেলুন"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <input
                  ref={userPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUserPhotoChange}
                  className="hidden"
                />
              </div>

              {/* Modal Save/Cancel Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserPhotoModalOpen(false)}
                  disabled={isSavingUserPhoto}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserPhoto}
                  disabled={isSavingUserPhoto}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingUserPhoto ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSavingUserPhoto ? "সংরক্ষণ হচ্ছে..." : "ছবি সেভ করুন"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. OWNER COMPANY / BUSINESS PROFILE & MANAGER MODAL */}
      {isBusinessModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Building2 size={18} className="text-amber-400" />
                <h3 className="font-bold text-base">মালিক কোম্পানি ও ম্যানেজার প্রোফাইল</h3>
              </div>
              <button
                onClick={() => setIsBusinessModalOpen(false)}
                disabled={isSavingBiz || isSavingManager}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex border-b border-gray-200 bg-slate-50 px-4 pt-2 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setBizModalTab("company")}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bizModalTab === "company"
                    ? "border-indigo-600 text-indigo-700 bg-white rounded-t-lg"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Building2 size={14} />
                <span>কোম্পানি তথ্য ও লোগো</span>
              </button>

              <button
                type="button"
                onClick={() => setBizModalTab("manager")}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bizModalTab === "manager"
                    ? "border-amber-600 text-amber-800 bg-white rounded-t-lg"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <UserCheck size={14} />
                <span>ম্যানেজার প্রোফাইল ও ফটো ({managersList.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {bizModalTab === "company" ? (
                <form onSubmit={handleSaveBusiness} className="space-y-4">
                  {/* Logo Upload Block */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {bizLogo ? (
                        <img src={bizLogo} alt="Business Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Building2 size={28} className="text-indigo-500" />
                          <span className="text-[10px] font-bold mt-1 text-slate-500">লোগো/ছবি</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-bold text-gray-900">
                        কোম্পানির অফিসিয়াল লোগো / ছবি
                      </label>
                      <p className="text-[11px] text-gray-500">
                        সাইডবার, হেডার এবং প্রিন্ট চালানে এই লোগোটি প্রদর্শিত হবে।
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => bizLogoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                        >
                          <Camera size={13} />
                          <span>{bizLogo ? "লোগো পরিবর্তন" : "লোগো আপলোড"}</span>
                        </button>
                        {bizLogo && (
                          <button
                            type="button"
                            onClick={() => setBizLogo(null)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="লোগো বাদ দিন"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                        <input
                          ref={bizLogoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBizLogoChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      কোম্পানির নাম (Business Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      placeholder="BOLAKA FACTORY"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-900"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      অফিসিয়াল মোবাইল / ফোন
                    </label>
                    <input
                      type="tel"
                      value={bizPhone}
                      onChange={(e) => setBizPhone(e.target.value)}
                      placeholder="01954223347"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-900"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ঠিকানা
                    </label>
                    <textarea
                      rows={2}
                      value={bizAddress}
                      onChange={(e) => setBizAddress(e.target.value)}
                      placeholder="যেমন: ঢাকা, বাংলাদেশ"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-900"
                    />
                  </div>

                  {/* Modal Save/Cancel Footer */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsBusinessModalOpen(false)}
                      disabled={isSavingBiz}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingBiz}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingBiz ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      <span>{isSavingBiz ? "সংরক্ষণ হচ্ছে..." : "কোম্পানি তথ্য সেভ করুন"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* MANAGER TAB */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">ম্যানেজার তালিকা ও প্রোফাইল ফটো</h4>
                      <p className="text-xs text-gray-500">ম্যানেজারের ছবি পরিবর্তন বা নতুন ম্যানেজার যোগ করুন</p>
                    </div>
                    {!isAddingManager && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingManagerId(null);
                          setMgrUsername("");
                          setMgrPassword("");
                          setMgrImage(null);
                          setIsAddingManager(true);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>নতুন ম্যানেজার যোগ করুন</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Manager Form */}
                  {isAddingManager && (
                    <form onSubmit={handleSaveManager} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">
                          {editingManagerId ? "ম্যানেজার এডিট / পাসওয়ার্ড পরিবর্তন" : "নতুন ম্যানেজার তৈরি করুন"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingManager(false);
                            setEditingManagerId(null);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Photo Upload */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-dashed border-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                            {mgrImage ? (
                              <img src={mgrImage} alt="Manager" className="w-full h-full object-cover" />
                            ) : (
                              <User size={24} className="text-amber-500" />
                            )}
                          </div>
                          {mgrImage && (
                            <button
                              type="button"
                              onClick={() => setMgrImage(null)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer inline-flex items-center gap-1 shadow-2xs">
                            <Camera size={12} className="text-amber-600" />
                            <span>{mgrImage ? "ছবি পরিবর্তন" : "প্রোফাইল ছবি দিন"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const comp = await compressImageFile(file, 400, 400, 0.82);
                                    setMgrImage(comp);
                                  } catch (err: any) {
                                    alert(err.message || "ছবি আপলোড সমস্যা");
                                  }
                                }
                              }}
                            />
                          </label>
                          <p className="text-[10px] text-gray-500 mt-0.5">ম্যানেজারের প্রোফাইল ফটো (ঐচ্ছিক)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            ইউজারনেম <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={mgrUsername}
                            onChange={(e) => setMgrUsername(e.target.value)}
                            disabled={!!editingManagerId}
                            placeholder="যেমন: manager2"
                            className="w-full p-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            {editingManagerId ? "নতুন পাসওয়ার্ড (ঐচ্ছিক)" : "পাসওয়ার্ড (ন্যূনতম ৩ অক্ষর)"} {!editingManagerId && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="password"
                            value={mgrPassword}
                            onChange={(e) => setMgrPassword(e.target.value)}
                            placeholder={editingManagerId ? "পরিবর্তন না করলে খালি রাখুন" : "পাসওয়ার্ড লিখুন"}
                            className="w-full p-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white font-medium"
                            required={!editingManagerId}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingManager(false);
                            setEditingManagerId(null);
                          }}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingManager}
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {isSavingManager ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                          <span>{isSavingManager ? "সেভ হচ্ছে..." : "ম্যানেজার সংরক্ষণ করুন"}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Managers List */}
                  {isLoadingManagers ? (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                      <Loader2 size={24} className="animate-spin text-amber-600 mb-2" />
                      <span className="text-xs">ম্যানেজার তালিকা লোড হচ্ছে...</span>
                    </div>
                  ) : managersList.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-2 bg-slate-50">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <UserCheck size={24} />
                      </div>
                      <h5 className="text-sm font-bold text-gray-800">কোনো ম্যানেজার অ্যাকাউন্ট নেই</h5>
                      <p className="text-xs text-gray-500 max-w-xs mx-auto">
                        সাইন-আপের সময় ম্যানেজার যুক্ত করা না হলেও আপনি এখান থেকে যেকোনো সময় নতুন ম্যানেজার তৈরি করতে পারেন।
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingManagerId(null);
                          setMgrUsername("");
                          setMgrPassword("");
                          setMgrImage(null);
                          setIsAddingManager(true);
                        }}
                        className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                      >
                        + এখনই ম্যানেজার যোগ করুন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {managersList.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar with Camera update button */}
                            <div className="relative group shrink-0">
                              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs border border-gray-200">
                                {m.image ? (
                                  <img src={m.image} alt={m.username} className="w-full h-full object-cover" />
                                ) : (
                                  m.username.charAt(0).toUpperCase()
                                )}
                              </div>
                              <label
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer"
                                title="ম্যানেজারের ছবি পরিবর্তন করুন"
                              >
                                <Camera size={10} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpdateManagerPhotoDirect(m.id, file);
                                  }}
                                />
                              </label>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">{m.username}</span>
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                                  ম্যানেজার
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                অ্যাকাউন্ট তৈরি: {new Date(m.createdAt).toLocaleDateString("bn-BD")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <label className="px-2.5 py-1 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 text-gray-700 hover:text-amber-800 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1">
                              <Camera size={12} className="text-amber-600" />
                              <span className="hidden sm:inline">ছবি বদলান</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUpdateManagerPhotoDirect(m.id, file);
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingManagerId(m.id);
                                setMgrUsername(m.username);
                                setMgrPassword("");
                                setMgrImage(m.image || null);
                                setIsAddingManager(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="পাসওয়ার্ড পরিবর্তন করুন"
                            >
                              <KeyRound size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
