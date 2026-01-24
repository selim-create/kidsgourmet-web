import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Açık Rıza Metni | KidsGourmet',
  description: 'KidsGourmet Özel Nitelikli Kişisel Verilerin İşlenmesine İlişkin Açık Rıza Beyanı.',
};

export default function AcikRizaMetniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header Section - Standart Tasarım */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Açık Rıza Metni</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            ÖZEL NİTELİKLİ KİŞİSEL VERİLERİN İŞLENMESİNE İLİŞKİN AÇIK RIZA BEYANI
          </h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Giriş */}
          <div className="text-gray-700 text-lg leading-relaxed">
            <p>
              <strong className="text-slate-900">KidsGourmet</strong> tarafından sunulan platform hizmetleri kapsamında; 
              çocuk profili oluşturma, aşı takvimi takibi, gelişim (persentil) hesaplamaları ve kişiselleştirilmiş 
              beslenme önerileri sunulabilmesi amacıyla;
            </p>
          </div>

          {/* Maddeler */}
          <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-orange-500 mt-1.5"></i>
                <span className="text-gray-700">
                  Paylaştığım çocuğuma ait doğum tarihi, boy, kilo gibi <strong>fiziksel gelişim verilerinin</strong>,
                </span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-orange-500 mt-1.5"></i>
                <span className="text-gray-700">
                  Aşı geçmişi ve gelecek aşı planlamalarına dair <strong>sağlık bilgilerinin</strong>,
                </span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-orange-500 mt-1.5"></i>
                <span className="text-gray-700">
                  Varsa besin alerjisi ve hassasiyetlerine ilişkin <strong>sağlık verilerinin</strong>;
                </span>
              </li>
            </ul>
          </div>

          {/* Sonuç Beyanı */}
          <div className="text-gray-700 leading-relaxed">
            <p>
              <Link href="/aydinlatma-metni" className="text-orange-600 font-bold hover:underline">Aydınlatma Metni</Link>&rsquo;nde 
              belirtilen amaçlarla sınırlı olmak kaydıyla işlenmesine, sistemde kaydedilmesine ve hizmetin doğası gereği 
              teknik altyapı sağlayıcılarına aktarılmasına bilerek ve isteyerek rıza gösteriyorum.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Onay Kutusu Görünümü (Statik Gösterim) */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
            <div className="text-green-600 text-2xl mt-0.5">
              <i className="fa-regular fa-square-check"></i>
            </div>
            <div>
              <p className="font-bold text-green-900">
                Kabul Beyanı
              </p>
              <p className="text-green-800 text-sm mt-1">
                Çocuğuma ait sağlık ve gelişim verilerinin yukarıda belirtilen kapsamda işlenmesine açık rıza veriyorum.
              </p>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
            <span>Veri Sorumlusu: HİP Medya</span>
            <span>Son Güncelleme: Ocak 2026</span>
          </div>

        </div>
      </div>
    </div>
  );
}