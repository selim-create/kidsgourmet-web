import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | KidsGourmet',
  description: 'KidsGourmet kullanım koşulları, hizmet şartları ve kullanıcı sorumlulukları.',
};

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Kullanım Koşulları</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Kullanım Koşulları</h1>
          <p className="text-gray-600 mt-3">KidsGourmet platformunu kullanırken uymanız gereken kurallar ve koşullar</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Giriş */}
          <div>
            <p className="text-gray-600 leading-relaxed">
              Bu kullanım koşulları, KidsGourmet web sitesini kullanırken uymanız gereken kuralları ve koşulları belirtir. 
              Sitemizi kullanarak bu koşulları kabul etmiş sayılırsınız.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Hizmet Şartları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Hizmet Şartları</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, bebek ve çocuk beslenmesi konusunda bilgi, tarif ve araçlar sunan bir platformdur. 
                Platformumuzu kullanarak aşağıdaki şartları kabul etmiş olursunuz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>18 yaşından büyük olduğunuzu veya ebeveyn/vasi izniyle siteyi kullandığınızı,</li>
                <li>Verdiğiniz bilgilerin doğru ve güncel olduğunu,</li>
                <li>Hesap güvenliğinizden sorumlu olduğunuzu,</li>
                <li>Platformu yasalara uygun şekilde kullanacağınızı kabul edersiniz.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Kullanıcı Sorumlulukları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Kullanıcı Sorumlulukları</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed font-semibold text-slate-700">Kullanıcı olarak aşağıdaki davranışlardan kaçınmayı taahhüt edersiniz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Yanıltıcı, yanlış veya zararlı bilgi paylaşmak</li>
                <li>Başkalarının fikri mülkiyet haklarını ihlal etmek</li>
                <li>Spam, reklam veya ticari içerik göndermek (izin alınmadıkça)</li>
                <li>Platformun güvenliğini tehdit edecek aktivitelerde bulunmak</li>
                <li>Diğer kullanıcılara hakaret, tehdit veya rahatsızlık vermek</li>
                <li>Otomatik sistemler (bot, crawler) kullanarak içerik toplamak</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Fikri Mülkiyet Hakları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Fikri Mülkiyet Hakları</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet platformundaki tüm içerik, tasarım, logo, metin, görsel, tarif, yazılım ve diğer materyaller 
                Hip Medya ve/veya içerik sahiplerinin mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-700">İzin verilen kullanım:</strong> Kişisel, ticari olmayan amaçlarla içerikleri görüntüleyebilir ve yazdırabilirsiniz.
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-700">Yasak kullanım:</strong> İçerikleri ticari amaçla kullanmak, çoğaltmak, dağıtmak, değiştirmek veya 
                türev eserler oluşturmak için yazılı izin almanız gerekmektedir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* İçerik Kullanım Politikası */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. İçerik Kullanım Politikası</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Kullanıcılar tarafından oluşturulan içerikler (yorumlar, sorular, cevaplar, tarifler) için:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>İçeriğinizin sorumluluğu size aittir</li>
                <li>KidsGourmet, uygunsuz içerikleri kaldırma hakkını saklı tutar</li>
                <li>Paylaştığınız içeriği platformda kullanma ve gösterme hakkını KidsGourmet'ye vermiş olursunuz</li>
                <li>Diğer kullanıcıların fikri mülkiyet haklarına saygı göstermelisiniz</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Hesap Kuralları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Hesap Kuralları</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet hesabınızı oluştururken ve kullanırken:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gerçek ve doğru bilgiler vermelisiniz</li>
                <li>Hesap şifrenizi güvende tutmalısınız</li>
                <li>Hesabınızı başkalarıyla paylaşmamalısınız</li>
                <li>Şüpheli aktiviteleri derhal bildirmelisiniz</li>
                <li>Birden fazla sahte hesap açmamalısınız</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Kurallara uymamanız durumunda hesabınız askıya alınabilir veya silinebilir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Sorumluluk Reddi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Sorumluluk Reddi</h2>
            <div className="space-y-3 text-gray-600">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="leading-relaxed font-semibold text-orange-800">
                  ⚠️ Önemli Uyarı: KidsGourmet'deki içerikler bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez.
                </p>
              </div>
              <p className="leading-relaxed mt-4">
                Platform üzerindeki tarif ve beslenme bilgileri genel bilgilendirme amaçlı olup, çocuğunuzun özel sağlık durumu için 
                mutlaka bir sağlık profesyoneline danışmalısınız.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>KidsGourmet, içeriklerin doğruluğunu garanti etmez</li>
                <li>İçeriklerin kullanımından doğabilecek zararlardan sorumlu değildir</li>
                <li>Üçüncü taraf bağlantılarından sorumlu değildir</li>
                <li>Hizmetin kesintisiz olacağını garanti etmez</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Değişiklikler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Kullanım Koşullarında Değişiklikler</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutar. 
                Değişiklikler bu sayfada yayınlanacak ve yürürlüğe girecektir. Siteyi kullanmaya devam ederek 
                güncel koşulları kabul etmiş sayılırsınuz.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* İletişim */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. İletişim</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Kullanım koşulları hakkında sorularınız için:
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-700">E-posta:</strong>{' '}
                <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                  iletisim@kidsgourmet.com.tr
                </a>
              </p>
              <p className="leading-relaxed">
                <Link href="/iletisim" className="text-orange-500 hover:underline">
                  İletişim formu →
                </Link>
              </p>
            </div>
          </div>

          {/* Son Güncelleme */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Son güncelleme: Ocak 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
