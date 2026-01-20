import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet e-bülten aboneliği ve kişisel verilerin işlenmesi hakkında aydınlatma metni.',
};

export default function AydinlatmaMetniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Aydınlatma Metni</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">E-Bülten Aydınlatma Metni</h1>
          <p className="text-gray-600 mt-3">E-bülten aboneliği ve kişisel verilerin işlenmesi hakkında bilgiler</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* E-Bülten Bilgi Kutusu */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-envelope-open-text text-orange-500 text-2xl mt-1"></i>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">E-Bülten Aboneliği</h3>
              <p className="text-sm text-gray-600">
                Bu aydınlatma metni, KidsGourmet e-bülten aboneliği kapsamında işlenen kişisel verileriniz 
                hakkında 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca sizleri bilgilendirmek amacıyla hazırlanmıştır.
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          
          {/* Veri Sorumlusu */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full text-orange-500">
                <i className="fa-solid fa-building text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">1. Veri Sorumlusu</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, 
              <strong> Hip Medya Dijital Yayıncılık ve Teknoloji A.Ş.</strong> ("KidsGourmet") tarafından 
              e-bülten aboneliği kapsamında işlenen kişisel verileriniz hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* İşlenen Kişisel Veriler */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
                <i className="fa-solid fa-database text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">2. İşlenen Kişisel Veriler</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">E-bülten aboneliği kapsamında aşağıdaki kişisel verileriniz işlenmektedir:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-envelope text-orange-500 mr-2"></i>
                  E-posta adresi
                </h4>
                <p className="text-sm text-gray-600">Bülten gönderimi için</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-user text-orange-500 mr-2"></i>
                  Ad (opsiyonel)
                </h4>
                <p className="text-sm text-gray-600">Kişiselleştirilmiş içerik sunumu için</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-network-wired text-orange-500 mr-2"></i>
                  IP adresi
                </h4>
                <p className="text-sm text-gray-600">Güvenlik ve doğrulama için</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-calendar text-orange-500 mr-2"></i>
                  Abonelik tarihi
                </h4>
                <p className="text-sm text-gray-600">Kayıt yönetimi için</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* İşleme Amaçları */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full text-purple-500">
                <i className="fa-solid fa-bullseye text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">3. İşleme Amaçları</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Haftalık bülten gönderimi</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Yeni tarif ve içerik duyuruları</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Beslenme ipuçları ve önerileri paylaşımı</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Kampanya ve özel içerik bilgilendirmeleri</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Hizmet kalitesinin iyileştirilmesi</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Hukuki Sebep */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green-500">
                <i className="fa-solid fa-scale-balanced text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">4. Hukuki Sebep</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kişisel verileriniz, KVKK'nın 5. maddesinin 1. fıkrası kapsamında <strong>açık rızanıza</strong> dayalı olarak işlenmektedir. 
              Abone ol butonuna tıklayarak ve bu aydınlatma metnini kabul ederek açık rızanızı vermiş olursunuz.
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Verilerin Aktarılması */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-500">
                <i className="fa-solid fa-share-nodes text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">5. Verilerin Aktarılması</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              E-posta gönderim hizmetleri için verileriniz, yurt içi ve yurt dışındaki e-posta servis sağlayıcılarına 
              (örn. e-posta pazarlama platformları) aktarılabilir. Bu aktarım, KVKK'nın 8. ve 9. maddeleri 
              kapsamında ve gerekli güvenlik önlemleri alınarak gerçekleştirilmektedir.
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Veri Saklama Süresi */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-full text-teal-500">
                <i className="fa-solid fa-clock text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">6. Veri Saklama Süresi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kişisel verileriniz, e-bülten aboneliğiniz devam ettiği sürece saklanacaktır. 
              Abonelikten çıkmanız halinde, yasal saklama süreleri saklı kalmak kaydıyla verileriniz silinecektir.
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Haklarınız */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full text-red-500">
                <i className="fa-solid fa-user-shield text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">7. Haklarınız</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">İşlenen veriler hakkında bilgi talep etme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Verilerin düzeltilmesini veya silinmesini isteme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">İşlemeye itiraz etme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Herhangi bir zamanda abonelikten çıkma</span>
              </div>
            </div>
          </div>

          {/* Son Güncelleme */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Son güncelleme: Ocak 2025
            </p>
          </div>

        </div>

        {/* Abonelikten Çıkma Kutusu */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-300 rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-full text-white">
              <i className="fa-solid fa-right-from-bracket text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Abonelikten Çıkma</h2>
          </div>
          <div className="space-y-3 text-gray-600">
            <p className="leading-relaxed">
              Dilediğiniz zaman e-bültenlerin altındaki <strong>"Abonelikten Çık"</strong> linkine tıklayarak 
              veya aşağıdaki e-posta adresine mesaj göndererek aboneliğinizi sonlandırabilirsiniz.
            </p>
            <div className="bg-white border border-orange-200 rounded-lg p-4 mt-4">
              <p className="text-sm">
                <i className="fa-solid fa-envelope text-orange-500 mr-2"></i>
                <strong className="text-slate-800">E-posta:</strong>{' '}
                <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                  iletisim@kidsgourmet.com.tr
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* İletişim Kartı */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-full text-white">
              <i className="fa-solid fa-address-card text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">İletişim</h2>
          </div>
          <div className="space-y-3 text-gray-600">
            <p className="leading-relaxed">
              Kişisel verilerinizle ilgili sorularınız için:
            </p>
            <div className="space-y-2">
              <p>
                <strong className="text-slate-800">E-posta:</strong>{' '}
                <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                  kvkk@kidsgourmet.com.tr
                </a>
              </p>
              <p>
                <strong className="text-slate-800">Detaylı bilgi için:</strong>{' '}
                <Link href="/kvkk" className="text-orange-500 hover:underline">
                  KVKK Aydınlatma Metni
                </Link>
              </p>
            </div>
            <p className="text-sm mt-4 bg-white border border-gray-200 rounded-lg p-4">
              <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
              Tüm sorularınız ve talepleriniz için yukarıdaki iletişim bilgilerini kullanabilirsiniz.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
