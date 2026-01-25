"use client";

import Link from 'next/link';
import { useState } from 'react';

// Interface güncellendi: answer artık HTML/JSX içeriği de kabul ediyor
interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: 'account' | 'recipes' | 'technical' | 'general';
}

const faqData: FAQItem[] = [
  {
    category: 'account',
    question: 'Nasıl hesap oluşturabilirim?',
    answer: 'Sağ üst köşedeki "Kayıt Ol" butonuna tıklayarak e-posta adresiniz ve şifrenizle ücretsiz hesap oluşturabilirsiniz. Ayrıca Google veya Facebook hesabınızla da hızlıca kayıt olabilirsiniz.'
  },
  {
    category: 'account',
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayın. E-posta adresinizi girerek şifre sıfırlama bağlantısı alabilirsiniz. E-posta gelmezse spam klasörünü kontrol edin.'
  },
  {
    category: 'account',
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Hesap ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz. Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.'
  },
  {
    category: 'account',
    question: 'E-posta adresimi değiştirebilir miyim?',
    answer: 'Evet, profil ayarlarından e-posta adresinizi güncelleyebilirsiniz. Yeni e-posta adresinize doğrulama linki gönderilecektir.'
  },
  {
    category: 'recipes',
    question: 'Tarifleri nasıl filtreleyebilirim?',
    answer: 'Tarifler sayfasında yaş grubu, öğün türü, hazırlama süresi, alerjen bilgisi gibi filtreleri kullanabilirsiniz. Ayrıca arama kutusundan malzeme veya tarif adı ile arama yapabilirsiniz.'
  },
  {
    category: 'recipes',
    question: 'Tarifleri favorilerime nasıl eklerim?',
    answer: 'Tarif kartındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz. Favorilere erişmek için üst menüdeki "Favoriler" sekmesini kullanın.'
  },
  {
    category: 'recipes',
    question: 'Tariflerdeki besin değerleri güvenilir mi?',
    answer: 'Evet, tariflerdeki besin değerleri güncel veritabanlarından alınmaktadır. Ancak beslenme konusunda özel gereksinim durumunda hekiminize danışmanız gerekir.'
  },
  {
    category: 'technical',
    question: 'Mobil uygulama var mı?',
    answer: 'Şu anda mobil uygulamamız bulunmamaktadır ancak web sitemiz tüm mobil cihazlarda sorunsuz çalışacak şekilde optimize edilmiştir. Mobil tarayıcınızdan siteye erişebilirsiniz.'
  },
  {
    category: 'technical',
    question: 'Site yavaş yükleniyor, ne yapmalıyım?',
    answer: 'Tarayıcınızın önbelleğini temizleyin, farklı bir tarayıcı deneyin veya internet bağlantınızı kontrol edin. Sorun devam ederse bize bildirin.'
  },
  {
    category: 'technical',
    question: 'Çerezleri nasıl yönetebilirim?',
    answer: 'Çerez tercihlerinizi site altındaki çerez yönetim panelinden veya tarayıcı ayarlarınızdan yönetebilirsiniz. Detaylı bilgi için Çerez Politikası sayfamızı ziyaret edin.'
  },
  {
    category: 'general',
    question: 'KidsGourmet ücretsiz mi?',
    answer: 'Evet, KidsGourmet\'nin tüm temel özellikleri tamamen ücretsizdir. Tariflere erişim, topluluk forumları, beslenme rehberi ve araçlar ücretsiz kullanılabilir.'
  },
  {
    category: 'general',
    question: 'Uzmanlarınız kimler?',
    answer: 'İçeriklerimiz diyetisyenler ve çocuk doktorlarının katkılarıyla oluşmaktadır. Sitemize katkı sunan isimleri "Uzmanlarımız" sayfasından görebilirsiniz.'
  },
  {
    category: 'general',
    question: 'Bülten aboneliğinden nasıl çıkabilirim?',
    answer: 'Gönderilen her bültenin altındaki "Abonelikten Çık" linkini kullanabilir veya hesap ayarlarınızdan bülten tercihlerinizi değiştirebilirsiniz.'
  },
  {
    category: 'general',
    question: 'İçerikleriniz tıbbi tavsiye midir?',
    answer: 'Hayır, KidsGourmet\'deki içerikler genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Çocuğunuzun sağlığıyla ilgili sorularınız için mutlaka bir sağlık profesyoneline danışmalısınız.'
  },
  // --- YENİ EKLENEN ODAK SORULARI ---
  {
    category: 'general',
    question: 'Topluluk sayfasında Odak nedir?',
    answer: 'Odaklar, Topluluk sayfasındaki tartışmaları konu bazlı kategorilere ayıran bir sistemdir. Esasen bir forum alt kategorisi/ilgi grubu mantığında çalışır. Topluluk içeriğini organize eden ve kullanıcıların ilgi alanlarına göre içerik keşfetmesini kolaylaştıran bir sistemidir.'
  },
  {
    category: 'general',
    question: 'Odakların amacı nedir?',
    answer: (
      <ul className="list-none space-y-2">
        <li>
          <strong className="block text-slate-700">İçerik Organizasyonu:</strong>
          Tartışmaları belirli konulara göre gruplandırır.
        </li>
        <li>
          <strong className="block text-slate-700">Kişiselleştirilmiş Deneyim:</strong>
          Kullanıcılar ilgilendiği odakları takip edebilir, böylece sadece ilgili konuları görür.
        </li>
        <li>
          <strong className="block text-slate-700">Filtreleme:</strong>
          Ana topluluk sayfasında tartışmaları odaklara göre filtreleme imkanı sağlar.
        </li>
        <li>
          <strong className="block text-slate-700">Soru Sorma:</strong>
          Yeni tartışma açarken zorunlu olarak bir odak seçilir.
        </li>
      </ul>
    )
  }
];

export default function YardimPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Tümü', icon: 'fa-list' },
    { id: 'account', label: 'Hesap Yönetimi', icon: 'fa-user' },
    { id: 'recipes', label: 'Tarif Kullanımı', icon: 'fa-utensils' },
    { id: 'technical', label: 'Teknik Sorunlar', icon: 'fa-wrench' },
    { id: 'general', label: 'Genel', icon: 'fa-circle-question' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Yardım & Destek</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Yardım & Destek</h1>
          <p className="text-gray-600 mt-3">KidsGourmet ile ilgili her konuda, tüm kanallardan bize ulaşabilirsiniz.</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Destek Kanalları */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-envelope text-orange-500 text-xl"></i>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">E-Posta Desteği</h3>
            <p className="text-sm text-gray-600 mb-4">7/24 Ulaşın</p>
            <a 
              href="mailto:iletisim@kidsgourmet.com.tr" 
              className="text-orange-500 hover:underline text-sm font-semibold"
            >
              iletisim@kidsgourmet.com.tr
            </a>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-comments text-green-500 text-xl"></i>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Topluluk Forumu</h3>
            <p className="text-sm text-gray-600 mb-4">Diğer Kullanıcılara Sorun</p>
            <Link 
              href="/topluluk" 
              className="text-green-500 hover:underline text-sm font-semibold"
            >
              Foruma Git →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-brands fa-instagram text-blue-500 text-xl"></i>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Sosyal Medya</h3>
            <p className="text-sm text-gray-600 mb-4">Bizi Takip Edin</p>
            <a 
              href="https://www.instagram.com/kidsgourmet/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm font-semibold"
            >
              @kidsgourmet
            </a>
          </div>
        </div>

        {/* Sıkça Sorulan Sorular */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Sıkça Sorulan Sorular</h2>

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className={`fa-solid ${cat.icon} mr-2`}></i>
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-orange-200 transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
                  <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}></i>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {/* Düzenleme: <p> etiketi <div> yapıldı, böylece içeride <ul> kullanılabilir */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <i className="fa-solid fa-circle-question text-4xl mb-4 text-gray-300 block"></i>
              <p>Bu kategoride henüz soru bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Hala Yardıma mı İhtiyacınız Var? */}
        <div className="bg-gradient-to-r from-orange-50 to-white rounded-2xl shadow-sm border border-orange-100 p-8 md:p-12 mt-8 text-center">
          <i className="fa-solid fa-headset text-orange-500 text-5xl mb-4"></i>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Yardıma ihtiyacınız mı var?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten çekinmeyin. 
            Destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-paper-plane"></i>
            Bize Ulaşın
          </Link>
        </div>

      </div>
    </div>
  );
}