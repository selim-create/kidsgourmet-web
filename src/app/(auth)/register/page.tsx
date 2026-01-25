"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
    // DÜZELTME: overflow-x-hidden eklendi ve min-h-screen yapısı korundu
    <div className="flex min-h-screen bg-white overflow-x-hidden">
        
        {/* LEFT SIDE: DECORATIVE (Desktop Only) */}
        {/* DÜZELTME: width ve flex yapıları standart hale getirildi */}
        <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-orange-50 via-white to-yellow-50 items-center justify-center p-12 border-r border-orange-50">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -mr-20 -mt-20 mix-blend-multiply animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-100/50 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-multiply"></div>
            
            <div className="relative z-10 text-center max-w-md w-full">
                <div className="mb-8 inline-flex p-6 bg-white rounded-[2.5rem] shadow-xl shadow-orange-100/50 relative transform hover:scale-105 transition-transform duration-300">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent rounded-[2.5rem] opacity-50"></div>
                   <Image 
                      src="/kidsgourmet-icon.svg" 
                      alt="KidsGourmet İkon" 
                      width={100} 
                      height={100} 
                      className="w-24 h-24 object-contain relative z-10"
                   />
                </div>

                <h2 className="font-display font-bold text-4xl mb-6 text-slate-800 leading-tight">
                    Sağlıklı Nesiller<br/>
                    <span className="text-orange-500">Bilinçli Ebeveynler</span>
                </h2>
                
                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                    KidsGourmet ailesine katılarak çocuğunuzun beslenme yolculuğunu uzman rehberliğinde yönetin.
                </p>
                
                {/* Feature List */}
                <div className="space-y-5 text-left bg-white/80 p-8 rounded-3xl border border-orange-100/50 backdrop-blur-md shadow-sm">
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i className="fa-solid fa-check text-green-500"></i>
                        </div>
                        <span className="text-slate-700 font-bold">Uzman Görüşleri</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i className="fa-solid fa-wand-magic-sparkles text-blue-500"></i>
                        </div>
                        <span className="text-slate-700 font-bold">Akıllı Asistan Desteği</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center flex-shrink-0 transition-colors">
                            <i className="fa-solid fa-users text-purple-500"></i>
                        </div>
                        <span className="text-slate-700 font-bold">Güçlü Topluluk</span>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        {/* DÜZELTME: flex-1 ile kalan alanı doldurması sağlandı, padding artırıldı, margin kaldırıldı */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white w-full">
            <div className="mx-auto w-full max-w-sm lg:max-w-md">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6 group">
                        <div className="flex items-center justify-center gap-3">
                            <Image 
                                src="/kidsgourmet-icon.svg" 
                                alt="KidsGourmet" 
                                width={48} 
                                height={48} 
                                className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform duration-300"
                            />
                            <Image 
                                src="/kidsgourmet-text.svg" 
                                alt="KidsGourmet Text" 
                                width={160} 
                                height={40} 
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    </Link>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-2">Hesap Oluşturun</h2>
                    <p className="text-slate-500">
                        Zaten üye misiniz? <Link href="/login" className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition-all">Giriş Yap</Link>
                    </p>
                </div>

                {/* Google Sign-In */}
                <div className="mb-8">
                    <div 
                      id="google-register-button" 
                      ref={googleButtonRef}
                      className="w-full flex justify-center h-[44px]"
                    >
                      {!isScriptLoaded && (
                        <div className="w-full h-[44px] bg-gray-50 border border-gray-200 rounded animate-pulse"></div>
                      )}
                    </div>
                    {googleError && <p className="text-red-500 text-xs text-center mt-2">{googleError}</p>}
                    
                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider"><span className="px-3 bg-white text-gray-400">veya e-posta ile</span></div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                    <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Compact Grid for Name/Username */}
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Ad Soyad</label>
                            <input 
                              type="text" 
                              required 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 h-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 text-base transition-all bg-gray-50/50 focus:bg-white outline-none placeholder:text-gray-400"
                              placeholder="Adınız Soyadınız"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Kullanıcı Adı <span className="text-gray-400 font-normal text-xs">(Opsiyonel)</span></label>
                            <input 
                              type="text" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="w-full px-4 h-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 text-base transition-all bg-gray-50/50 focus:bg-white outline-none placeholder:text-gray-400"
                              placeholder="kullaniciadi"
                            />
                        </div>
                    </div>

                    {/* Email & Password */}
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">E-Posta</label>
                            <input 
                              type="email" 
                              required 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 h-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 text-base transition-all bg-gray-50/50 focus:bg-white outline-none placeholder:text-gray-400"
                              placeholder="ornek@email.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Şifre</label>
                            <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 h-12 pr-12 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 text-base transition-all bg-gray-50/50 focus:bg-white outline-none placeholder:text-gray-400"
                                placeholder="En az 6 karakter"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-600 transition-colors w-12 justify-end outline-none"
                                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                              >
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                              </button>
                            </div>
                        </div>
                    </div>

                    {/* Child Profile Section */}
                    <div className="bg-orange-50/40 rounded-2xl p-5 border border-orange-100/80">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
                                    <i className="fa-solid fa-baby text-orange-500"></i>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">Çocuk Profili</h3>
                                    <p className="text-[10px] text-slate-500 leading-tight">İçerikleri çocuğunuza göre özelleştirin</p>
                                </div>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button
                                type="button"
                                onClick={() => setSkipChild(!skipChild)}
                                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${!skipChild ? 'bg-orange-500' : 'bg-slate-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${!skipChild ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {!skipChild && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Çocuğun Adı</label>
                                    <input 
                                    type="text" 
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    className="w-full px-4 h-11 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm bg-white" 
                                    placeholder="Adı" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Doğum Tarihi</label>
                                    <input 
                                    type="date" 
                                    value={childBirthDate}
                                    onChange={(e) => setChildBirthDate(e.target.value)}
                                    className="w-full px-4 h-11 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm text-gray-600 bg-white" 
                                    />
                                </div>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Consents Section */}
                    <div className="space-y-4 pt-2">
                        {/* Guardian Declaration */}
                        {!skipChild && (
                          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                            <label className="flex items-start gap-3 cursor-pointer group select-none">
                              <div className="relative flex items-center pt-0.5">
                                <input
                                    type="checkbox"
                                    checked={guardianDeclaration}
                                    onChange={(e) => setGuardianDeclaration(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                                />
                                <i className="fa-solid fa-check pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                              </div>
                              <span className="text-xs text-slate-600 leading-relaxed">
                                <strong>18 yaşından büyük olduğumu</strong> ve bu platformda paylaşacağım çocuk bilgilerini <strong>yasal veli/vasi sıfatıyla</strong> paylaştığımı beyan ederim.
                              </span>
                            </label>
                          </div>
                        )}

                        {/* Sensitive Data Consent */}
                        {!skipChild && (
                          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                            <label className="flex items-start gap-3 cursor-pointer group select-none">
                              <div className="relative flex items-center pt-0.5">
                                <input
                                    type="checkbox"
                                    checked={sensitiveDataConsent}
                                    onChange={(e) => setSensitiveDataConsent(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                                />
                                <i className="fa-solid fa-check pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                              </div>
                              <span className="text-xs text-slate-600 leading-relaxed">
                                Çocuğuma ait sağlık ve gelişim verilerinin işlenmesine <Link href="/acik-riza-metni" className="text-orange-600 hover:underline font-bold" target="_blank">Açık Rıza Metni</Link>'nde belirtilen şartlarla onay veriyorum.
                              </span>
                            </label>
                          </div>
                        )}

                        {/* Terms Consent */}
                        <label className="flex items-start gap-3 cursor-pointer group select-none px-1">
                            <div className="relative flex items-center pt-0.5">
                                <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-slate-800 checked:bg-slate-800 hover:border-slate-600"
                                required
                                />
                                <i className="fa-solid fa-check pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                            </div>
                            <span className="text-xs text-slate-500 leading-relaxed">
                                <Link href="/kullanim-kosullari" className="text-slate-800 hover:text-orange-600 font-bold hover:underline" target="_blank">Kullanım Koşulları</Link>'nı ve <Link href="/gizlilik-politikasi" className="text-slate-800 hover:text-orange-600 font-bold hover:underline" target="_blank">Gizlilik Politikası</Link>'nı okudum, kabul ediyorum.
                            </span>
                        </label>

                        {/* KVKK Info */}
                        <p className="text-[10px] text-slate-400 px-1 leading-relaxed pl-9">
                            Kişisel verilerinizin işlenmesine ilişkin detaylı bilgiye <Link href="/kvkk" className="text-slate-600 hover:underline font-medium" target="_blank">KVKK Aydınlatma Metni</Link>'nden ulaşabilirsiniz.
                        </p>

                        {/* Marketing Consent */}
                        <label className="flex items-start gap-3 cursor-pointer group select-none px-1">
                            <div className="relative flex items-center pt-0.5">
                                <input
                                type="checkbox"
                                checked={marketingConsent}
                                onChange={(e) => setMarketingConsent(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                                />
                                <i className="fa-solid fa-check pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                            </div>
                            <span className="text-xs text-slate-500 leading-relaxed">
                                Kampanya ve tanıtım e-postaları almak istiyorum. (İsteğe bağlı)
                            </span>
                        </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading || googleLoading || !termsAccepted}
                      className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-200 focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-base mt-4 shadow-md"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> Kayıt Yapılıyor...
                            </span>
                        ) : "Ücretsiz Kayıt Ol"}
                    </button>
                </form>
                
                {/* Safe Area Spacer for Mobile */}
                <div className="h-8 lg:hidden"></div>
            </div>
        </div>
    </div>
  );
}