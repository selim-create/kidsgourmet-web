import Link from "next/link"; // Localde bu satırı açın

export default function NotFound() {
  return (
    <div className="bg-orange-50 min-h-screen flex flex-col relative overflow-hidden">

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-20">
            
            {/* Illustration */}
            <div className="mb-8 relative">
                <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center transform rotate-3 border-8 border-orange-100">
                    <i className="fa-solid fa-bowl-food text-orange-500 text-8xl"></i>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg animate-bounce">
                    <span className="text-4xl">🤷‍♀️</span>
                </div>
            </div>

            <h1 className="font-display font-bold text-6xl md:text-8xl text-orange-500 mb-2 font-sans">404</h1>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-800 mb-4">Eyvah! Bu sayfa mutfakta kaybolmuş.</h2>
            <p className="text-gray-600 text-lg max-w-lg mb-10">
                Aradığınız tarif veya içerik şu an menüde yok. Ama üzülmeyin, mutfağımızda daha binlerce lezzet var!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/" className="bg-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1 text-center">
                    Anasayfaya Dön
                </Link>
                <Link href="/arama" className="bg-white text-slate-700 border border-gray-200 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-all text-center">
                    Arama Yap
                </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-bold text-gray-500">
                <span>Popüler:</span>
                <Link href="/blog/ek-gida" className="hover:text-orange-500 underline">Ek Gıda</Link>
                <Link href="/etiket/blw" className="hover:text-orange-500 underline">BLW</Link>
                <Link href="/tarifler" className="hover:text-orange-500 underline">Pankek</Link>
                <Link href="/tarifler?kategori=corbalar" className="hover:text-orange-500 underline">Çorbalar</Link>
            </div>

        </main>

    </div>
  );
}