import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Açık Rıza Metni | Kids Gourmet',
  description: 'Kids Gourmet Açık Rıza Beyanı - Özel nitelikli kişisel verilerin işlenmesine ilişkin açık rıza metni',
};

export default function AcikRizaMetniPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Açık Rıza Metni</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 mb-6">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, özel nitelikli kişisel 
          verilerimin işlenmesine ilişkin aşağıdaki hususlarda bilgilendirildim:
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Veri Sorumlusu</h2>
        <p className="text-gray-600 mb-4">
          Hip Medya Dijital Pazarlama ve Ticaret Anonim Şirketi (&quot;Kids Gourmet&quot; veya &quot;Şirket&quot;)
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. İşlenen Özel Nitelikli Kişisel Veriler</h2>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Çocuğumun doğum tarihi ve yaşı</li>
          <li>Boy ve kilo bilgileri</li>
          <li>Alerji bilgileri</li>
          <li>Beslenme tercihleri ve diyet kısıtlamaları</li>
          <li>Aşı takvimi ve sağlık kayıtları</li>
          <li>Büyüme ve gelişim verileri (persentil)</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. İşleme Amaçları</h2>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Yaşa ve gelişim durumuna uygun tarif önerileri sunulması</li>
          <li>Alerjen uyarıları ve güvenli beslenme önerileri</li>
          <li>Persentil hesaplama ve büyüme takibi</li>
          <li>Aşı takvimi hatırlatmaları</li>
          <li>Kişiselleştirilmiş beslenme programları oluşturulması</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Verilerin Aktarımı</h2>
        <p className="text-gray-600 mb-4">
          Özel nitelikli kişisel verileriniz, yalnızca hizmet sunumu için zorunlu olan teknik 
          altyapı sağlayıcılarıyla (bulut sunucu hizmetleri) paylaşılmakta olup, üçüncü kişilerle 
          pazarlama amacıyla paylaşılmamaktadır.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Saklama Süresi</h2>
        <p className="text-gray-600 mb-4">
          Verileriniz, hesabınızı silene kadar veya talebiniz üzerine derhal silinecektir.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Haklarınız</h2>
        <p className="text-gray-600 mb-4">
          KVKK&apos;nın 11. maddesi kapsamında; verilerinize erişim, düzeltme, silme, işlemenin 
          kısıtlanmasını talep etme ve rızanızı geri çekme haklarına sahipsiniz.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-8">
          <h3 className="font-bold text-slate-800 mb-2">Açık Rıza Beyanı</h3>
          <p className="text-gray-600 text-sm">
            Yukarıda belirtilen özel nitelikli kişisel verilerimin, belirtilen amaçlarla 
            işlenmesine, saklanmasına ve gerekli teknik altyapı sağlayıcılarıyla paylaşılmasına 
            özgür iradem ile açık rıza veriyorum. Bu rızamı dilediğim zaman geri çekebileceğimi 
            biliyorum.
          </p>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Son güncelleme: Ocak 2026
        </p>
      </div>
    </div>
  );
}
