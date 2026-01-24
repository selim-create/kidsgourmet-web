"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; // Image import edildi
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { authService } from "@/services/auth-service";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const { isScriptLoaded, initializeGoogleButton, isLoading: googleLoading, error: googleError } = useGoogleAuth();
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [skipChild, setSkipChild] = useState(false);
  
  // Consents State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [sensitiveDataConsent, setSensitiveDataConsent] = useState(false);
  const [guardianDeclaration, setGuardianDeclaration] = useState(false);
  
  // UI State
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Google butonunu initialize et
  useEffect(() => {
    if (isScriptLoaded && googleButtonRef.current) {
      initializeGoogleButton('google-register-button', async () => {
        await refreshUser();
        router.push("/dashboard");
      });
    }
  }, [isScriptLoaded, initializeGoogleButton, refreshUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!termsAccepted) {
      setError("Devam etmek için Kullanıcı Sözleşmesi'ni kabul etmeniz gerekmektedir.");
      return;
    }

    if (!skipChild && childName.trim() && childBirthDate && !guardianDeclaration) {
      setError("Çocuk profili eklemek için veli/vasi beyanını onaylamanız gerekmektedir.");
      return;
    }

    if (!skipChild && childName.trim() && childBirthDate && !sensitiveDataConsent) {
      setError("Çocuk profili eklemek için açık rıza metnini onaylamanız gerekmektedir.");
      return;
    }
    
    setIsLoading(true);

    try {
      const registerData: any = {
        email,
        password,
        name,
        consents: {
          terms_accepted: termsAccepted,
          terms_accepted_at: new Date().toISOString(),
          marketing_consent: marketingConsent,
          marketing_consent_at: marketingConsent ? new Date().toISOString() : null,
          sensitive_data_consent: sensitiveDataConsent,
          sensitive_data_consent_at: sensitiveDataConsent ? new Date().toISOString() : null,
          guardian_declaration: guardianDeclaration,
          guardian_declaration_at: guardianDeclaration ? new Date().toISOString() : null,
        }
      };

      if (username.trim()) registerData.username = username.trim();

      if (!skipChild && childName.trim() && childBirthDate) {
        registerData.child = {
          name: childName.trim(),
          birth_date: childBirthDate,
        };
      }

      const response = await authService.register(registerData);
      await refreshUser();
      
      if (response.redirect_url) router.push(response.redirect_url);
      else if (response.is_expert) router.push("/dashboard/expert");
      else router.push("/dashboard");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız oldu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
        
        {/* LEFT SIDE: DECORATIVE (Desktop Only) - SOFT VERSION */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative items-center justify-center p-8 overflow-hidden border-r border-orange-50">
            {/* Soft Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-multiply animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-100/50 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply"></div>
            
            <div className="relative z-10 text-center max-w-sm">
                {/* Logo Icon with Soft Shadow (Only Icon Here) */}
                <div className="mb-8 inline-flex p-6 bg-white rounded-[2rem] shadow-xl shadow-orange-100/50 relative transform hover:scale-105 transition-transform duration-300">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-[2rem] opacity-50"></div>
                   <Image 
                      src="/kidsgourmet-icon.svg" 
                      alt="KidsGourmet İkon" 
                      width={80} 
                      height={80} 
                      className="w-20 h-20 object-contain relative z-10"
                   />
                </div>

                <h2 className="font-display font-bold text-3xl mb-4 text-slate-800 leading-tight">
                    Sağlıklı Nesiller<br/>
                    <span className="text-orange-500">Bilinçli Ebeveynler</span>
                </h2>
                
                <p className="text-slate-600 text-base leading-relaxed mb-8">
                    KidsGourmet ailesine katılarak çocuğunuzun beslenme yolculuğunu uzman rehberliğinde yönetin.
                </p>
                
                {/* Feature List - Clean Look */}
                <div className="space-y-4 text-left bg-white/60 p-6 rounded-2xl border border-orange-100/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i className="fa-solid fa-check text-green-500 text-sm"></i>
                        </div>
                        <span className="text-slate-700 font-medium text-sm">Uzman Görüşleri</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i className="fa-solid fa-wand-magic-sparkles text-blue-500 text-sm"></i>
                        </div>
                        <span className="text-slate-700 font-medium text-sm">Akıllı Asistan Desteği</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i className="fa-solid fa-users text-purple-500 text-sm"></i>
                        </div>
                        <span className="text-slate-700 font-medium text-sm">Güçlü Topluluk</span>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: FORM (Scrollable) */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-4 py-8 lg:p-8 overflow-y-auto bg-white">
            <div className="w-full max-w-lg space-y-6">
                
                {/* Mobile Logo & Header - Updated with Split SVGs and Animation */}
                <div className="text-center lg:text-left">
                    <Link href="/" className="flex items-center gap-3 mb-4 lg:mb-6 group justify-center lg:justify-start">
                        {/* 1. Part: Carrot Icon (Animated) */}
                        <div className="relative flex items-center justify-center">
                            <Image 
                                src="/kidsgourmet-icon.svg" 
                                alt="KidsGourmet İkon" 
                                width={48} 
                                height={48} 
                                priority
                                className="w-12 h-12 object-contain transition-transform duration-300 ease-in-out group-hover:rotate-12"
                            />
                        </div>

                        {/* 2. Part: Text Logo (Static) */}
                        <div className="flex flex-col justify-center">
                            <Image 
                                src="/kidsgourmet-text.svg" 
                                alt="KidsGourmet" 
                                width={180} 
                                height={48} 
                                priority
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-800">Hesap Oluşturun</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Zaten üye misiniz? <Link href="/login" className="font-bold text-orange-500 hover:text-orange-600 underline decoration-2 decoration-orange-200 underline-offset-2">Giriş Yap</Link>
                    </p>
                </div>

                {/* Google Sign-In */}
                <div className="space-y-3">
                    <div 
                      id="google-register-button" 
                      ref={googleButtonRef}
                      className="w-full flex justify-center h-[44px]"
                    >
                      {!isScriptLoaded && (
                        <div className="w-full h-11 bg-gray-50 border border-gray-200 rounded animate-pulse"></div>
                      )}
                    </div>
                    {googleError && <p className="text-red-500 text-xs text-center">{googleError}</p>}
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-white text-gray-400">veya</span></div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Compact Grid for Name/Username */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Ad Soyad</label>
                            <input 
                              type="text" 
                              required 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-colors bg-gray-50/50 focus:bg-white"
                              placeholder="Adınız Soyadınız"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Kullanıcı Adı <span className="text-gray-400 font-normal">(Opsiyonel)</span></label>
                            <input 
                              type="text" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-colors bg-gray-50/50 focus:bg-white"
                              placeholder="kullaniciadi"
                            />
                        </div>
                    </div>

                    {/* Email & Password */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">E-Posta</label>
                            <input 
                              type="email" 
                              required 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-colors bg-gray-50/50 focus:bg-white"
                              placeholder="ornek@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Şifre</label>
                            <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-colors bg-gray-50/50 focus:bg-white"
                                placeholder="En az 6 karakter"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                              >
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              </button>
                            </div>
                        </div>
                    </div>

                    {/* Child Profile Section (Compact & Soft) */}
                    <div className="bg-orange-50/30 rounded-xl p-4 border border-orange-100/60">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                                    <i className="fa-solid fa-baby text-orange-500 text-[10px]"></i>
                                </div>
                                Çocuk Profili Ekle
                            </h3>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400 cursor-pointer hover:text-orange-500 transition-colors" htmlFor="skipChild">
                                    {skipChild ? "EKLE" : "ATLA"}
                                </label>
                                <button
                                  type="button"
                                  id="skipChild"
                                  onClick={() => setSkipChild(!skipChild)}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${skipChild ? 'bg-gray-200' : 'bg-orange-400'}`}
                                >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm ${skipChild ? 'translate-x-1' : 'translate-x-5'}`} />
                                </button>
                            </div>
                        </div>

                        {!skipChild && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <input 
                              type="text" 
                              value={childName}
                              onChange={(e) => setChildName(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 text-sm bg-white" 
                              placeholder="Çocuğun Adı" 
                            />
                            <input 
                              type="date" 
                              value={childBirthDate}
                              onChange={(e) => setChildBirthDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 text-sm text-gray-600 bg-white" 
                              placeholder="Çocuğunuzun Doğum Tarihi"
                            />
                          </div>
                        )}
                    </div>

                    {/* Guardian Declaration - Required when adding child */}
                    {!skipChild && (
                      <>
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <input
                            type="checkbox"
                            id="guardian-declaration"
                            checked={guardianDeclaration}
                            onChange={(e) => setGuardianDeclaration(e.target.checked)}
                            className="w-4 h-4 mt-1 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                          />
                          <label htmlFor="guardian-declaration" className="text-sm text-gray-700 cursor-pointer">
                            <strong>18 yaşından büyük olduğumu</strong> ve bu platformda paylaşacağım çocuk bilgilerini{' '}
                            <strong>yasal veli/vasi sıfatıyla</strong> paylaştığımı beyan ederim.
                          </label>
                        </div>

                        {/* Sensitive Data Consent - Required when adding child */}
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <input
                            type="checkbox"
                            id="sensitive-data-consent-required"
                            checked={sensitiveDataConsent}
                            onChange={(e) => setSensitiveDataConsent(e.target.checked)}
                            className="w-4 h-4 mt-1 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                          />
                          <label htmlFor="sensitive-data-consent-required" className="text-sm text-gray-700 cursor-pointer">
                            Çocuğuma ait sağlık ve gelişim verilerinin işlenmesine{' '}
                            <Link href="/acik-riza-metni" className="text-orange-500 hover:underline font-medium">
                              Açık Rıza Metni
                            </Link>
                            &apos;nde belirtilen şartlarla <strong>onay veriyorum</strong>.
                          </label>
                        </div>
                      </>
                    )}

                    {/* Consents (Compact) */}
                    <div className="space-y-3 pt-2">
                        {/* Terms Consent - Required */}
                        <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id="terms-consent"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="w-4 h-4 mt-1 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                              required
                            />
                            <label htmlFor="terms-consent" className="text-sm text-gray-600 cursor-pointer">
                                <Link href="/kullanim-kosullari" className="text-orange-500 hover:underline font-medium">
                                    Kullanım Koşulları
                                </Link>
                                &apos;nı ve{' '}
                                <Link href="/gizlilik-politikasi" className="text-orange-500 hover:underline font-medium">
                                    Gizlilik Politikası
                                </Link>
                                &apos;nı okudum, kabul ediyorum.
                            </label>
                        </div>

                        {/* KVKK Information Text */}
                        <p className="text-xs text-gray-500 mt-2">
                            Kişisel verilerinizin işlenmesine ilişkin detaylı bilgiye{' '}
                            <Link href="/kvkk" className="text-orange-500 hover:underline">
                                KVKK Aydınlatma Metni
                            </Link>
                            &apos;nden ulaşabilirsiniz.
                        </p>

                        {/* Optional Consents */}
                        <div className="space-y-2.5 pt-2">
                            <label className="flex items-start gap-2 cursor-pointer group select-none">
                                <input
                                  type="checkbox"
                                  checked={marketingConsent}
                                  onChange={(e) => setMarketingConsent(e.target.checked)}
                                  className="mt-0.5 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 accent-orange-500"
                                />
                                <span className="text-xs text-gray-500 leading-tight group-hover:text-gray-700 transition-colors">
                                    Kampanya ve tanıtım e-postaları almak istiyorum. (İsteğe bağlı)
                                </span>
                            </label>
                        </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading || googleLoading || !termsAccepted}
                      className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 hover:shadow-lg focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm mt-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fa-solid fa-circle-notch fa-spin"></i> Kayıt Yapılıyor...
                            </span>
                        ) : "Ücretsiz Kayıt Ol"}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}