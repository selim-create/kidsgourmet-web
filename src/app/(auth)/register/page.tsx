import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-180px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mx-auto max-w-6xl">
        
        {/* LEFT SIDE: IMAGE (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-green-50 relative items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-full blur-3xl -ml-10 -mb-10 opacity-70"></div>
            
            <div className="relative z-10 text-center max-w-lg">
                <div className="mb-8 relative inline-block">
                    <img src="https://placehold.co/500x500/AED581/ffffff?text=Saglikli+Baslangic" className="rounded-[3rem] shadow-2xl transform rotate-2 border-8 border-white" alt="Sağlıklı Başlangıç" />
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-brand-primary">
                            <i className="fa-solid fa-gift"></i>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase">Yeni Üyelere</p>
                            <p className="font-bold text-slate-800">Özel Rehberler</p>
                        </div>
                    </div>
                </div>
                <h2 className="font-display font-bold text-4xl text-slate-800 mb-4">Sağlıklı Bir Başlangıç.</h2>
                <p className="text-gray-600 text-lg">KidsGourmet ailesine katılarak çocuğunuzun gelişimine en uygun beslenme yolculuğunu başlatın.</p>
            </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-3xl font-display font-bold text-slate-800">Aramıza Katılın! 🚀</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Zaten hesabınız var mı? <Link href="/login" className="font-bold text-brand-secondary hover:text-green-600 transition-colors">Giriş Yap</Link>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                        <i className="fa-brands fa-google text-lg text-red-500"></i> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                        <i className="fa-brands fa-facebook text-lg text-blue-600"></i> Facebook
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 font-medium">veya e-posta ile kayıt</span>
                    </div>
                </div>

                <form className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-bold text-gray-700 mb-1">Ad Soyad</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-regular fa-user"></i>
                            </div>
                            <input id="fullname" name="fullname" type="text" required className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" placeholder="Adınız Soyadınız" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">E-Posta Adresi</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <input id="email" name="email" type="email" required className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" placeholder="ornek@email.com" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <input id="password" name="password" type="password" required className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" placeholder="En az 6 karakter" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-secondary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                            Ücretsiz Kayıt Ol
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}