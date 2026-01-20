import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni.',
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-orange-500"><i className="fa-solid fa-house"></i></Link></li>
            <li><i className="fa-solid fa-chevron-right text-xs"></i></li>
            <li className="font-semibold text-slate-800">KVKK Aydınlatma Metni</li>
          </ol>
        </nav>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              KVKK Aydınlatma Metni
            </h1>
            <p className="text-gray-500">Son güncelleme: Ocak 2025</p>
          </div>

          <div className="prose prose-slate max-w-none">
            
            <h2>1. Veri Sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verileriniz; 
              veri sorumlusu olarak <strong>Hip Medya Dijital Yayıncılık ve Teknoloji A.Ş.</strong> 
              ("KidsGourmet" veya "Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </p>

            <h2>2. Kişisel Verilerin İşlenme Amacı</h2>
            <p>Toplanan kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde;</p>
            <ul>
              <li>Üyelik işlemlerinin gerçekleştirilmesi ve yönetilmesi</li>
              <li>Hizmetlerimizin sunulması ve iyileştirilmesi</li>
              <li>İletişim faaliyetlerinin yürütülmesi</li>
              <li>Bülten ve kampanya bilgilendirmelerinin yapılması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Çocuk beslenmesi konusunda kişiselleştirilmiş içerik sunulması</li>
            </ul>
            <p>amaçlarıyla işlenebilecektir.</p>

            <h2>3. İşlenen Kişisel Veriler</h2>
            <p>Tarafımızca işlenen kişisel veri kategorileri şunlardır:</p>
            <ul>
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi</li>
              <li><strong>Çocuk Bilgileri:</strong> Çocuk adı, doğum tarihi, alerjen bilgileri (ebeveyn onayı ile)</li>
              <li><strong>Kullanım Verileri:</strong> Site kullanım istatistikleri, tercihler</li>
            </ul>

            <h2>4. Kişisel Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda; 
              iş ortaklarımıza, tedarikçilerimize, hizmet sağlayıcılarımıza ve yasal olarak yetkili 
              kamu kurumlarına KVKK'nın 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları 
              çerçevesinde aktarılabilecektir.
            </p>

            <h2>5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
            <p>
              Kişisel verileriniz, web sitemiz, mobil uygulamamız ve elektronik ortamlar aracılığıyla 
              otomatik veya otomatik olmayan yöntemlerle toplanmaktadır. Kişisel verileriniz KVKK'nın 
              5. maddesinde belirtilen;
            </p>
            <ul>
              <li>Açık rızanızın bulunması</li>
              <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması</li>
              <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</li>
              <li>Veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</li>
            </ul>
            <p>hukuki sebeplerine dayalı olarak işlenmektedir.</p>

            <h2>6. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme, silme veya yok edilme işlemlerinin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>

            <h2>7. Başvuru Yöntemi</h2>
            <p>
              Yukarıda belirtilen haklarınızı kullanmak için <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline">kvkk@kidsgourmet.com.tr</a> adresine 
              e-posta göndererek veya <Link href="/iletisim" className="text-orange-500 hover:underline">iletişim formu</Link> aracılığıyla 
              başvuruda bulunabilirsiniz.
            </p>

            <h2>8. İletişim Bilgileri</h2>
            <p>
              <strong>Hip Medya Dijital Yayıncılık ve Teknoloji A.Ş.</strong><br />
              E-posta: <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline">kvkk@kidsgourmet.com.tr</a><br />
              Web: <a href="https://kidsgourmet.com.tr" className="text-orange-500 hover:underline">kidsgourmet.com.tr</a>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
