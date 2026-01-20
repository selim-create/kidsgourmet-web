import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet e-bülten aboneliği ve kişisel verilerin işlenmesi hakkında aydınlatma metni.',
};

export default function AydinlatmaMetniPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-orange-500"><i className="fa-solid fa-house"></i></Link></li>
            <li><i className="fa-solid fa-chevron-right text-xs"></i></li>
            <li className="font-semibold text-slate-800">Aydınlatma Metni</li>
          </ol>
        </nav>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              E-Bülten Aydınlatma Metni
            </h1>
            <p className="text-gray-500">Son güncelleme: Ocak 2025</p>
          </div>

          <div className="prose prose-slate max-w-none">
            
            <h2>1. Veri Sorumlusu</h2>
            <p>
              Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, 
              <strong> Hip Medya Dijital Yayıncılık ve Teknoloji A.Ş.</strong> ("KidsGourmet") tarafından 
              e-bülten aboneliği kapsamında işlenen kişisel verileriniz hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.
            </p>

            <h2>2. İşlenen Kişisel Veriler</h2>
            <p>E-bülten aboneliği kapsamında aşağıdaki kişisel verileriniz işlenmektedir:</p>
            <ul>
              <li><strong>E-posta adresi:</strong> Bülten gönderimi için</li>
              <li><strong>Ad (opsiyonel):</strong> Kişiselleştirilmiş içerik sunumu için</li>
              <li><strong>IP adresi:</strong> Güvenlik ve doğrulama için</li>
              <li><strong>Abonelik tarihi:</strong> Kayıt yönetimi için</li>
            </ul>

            <h2>3. İşleme Amaçları</h2>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul>
              <li>Haftalık bülten gönderimi</li>
              <li>Yeni tarif ve içerik duyuruları</li>
              <li>Beslenme ipuçları ve önerileri paylaşımı</li>
              <li>Kampanya ve özel içerik bilgilendirmeleri</li>
              <li>Hizmet kalitesinin iyileştirilmesi</li>
            </ul>

            <h2>4. Hukuki Sebep</h2>
            <p>
              Kişisel verileriniz, KVKK'nın 5. maddesinin 1. fıkrası kapsamında <strong>açık rızanıza</strong> dayalı olarak işlenmektedir. 
              Abone ol butonuna tıklayarak ve bu aydınlatma metnini kabul ederek açık rızanızı vermiş olursunuz.
            </p>

            <h2>5. Verilerin Aktarılması</h2>
            <p>
              E-posta gönderim hizmetleri için verileriniz, yurt içi ve yurt dışındaki e-posta servis sağlayıcılarına 
              (örn. e-posta pazarlama platformları) aktarılabilir. Bu aktarım, KVKK'nın 8. ve 9. maddeleri 
              kapsamında ve gerekli güvenlik önlemleri alınarak gerçekleştirilmektedir.
            </p>

            <h2>6. Veri Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, e-bülten aboneliğiniz devam ettiği sürece saklanacaktır. 
              Abonelikten çıkmanız halinde, yasal saklama süreleri saklı kalmak kaydıyla verileriniz silinecektir.
            </p>

            <h2>7. Haklarınız</h2>
            <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen veriler hakkında bilgi talep etme</li>
              <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
              <li>İşlemeye itiraz etme</li>
              <li>Herhangi bir zamanda abonelikten çıkma</li>
            </ul>

            <h2>8. Abonelikten Çıkma</h2>
            <p>
              Dilediğiniz zaman e-bültenlerin altındaki "Abonelikten Çık" linkine tıklayarak veya 
              <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline"> iletisim@kidsgourmet.com.tr</a> adresine 
              e-posta göndererek aboneliğinizi sonlandırabilirsiniz.
            </p>

            <h2>9. İletişim</h2>
            <p>
              Kişisel verilerinizle ilgili sorularınız için:<br />
              E-posta: <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline">kvkk@kidsgourmet.com.tr</a><br />
              Detaylı bilgi için: <Link href="/kvkk" className="text-orange-500 hover:underline">KVKK Aydınlatma Metni</Link>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
