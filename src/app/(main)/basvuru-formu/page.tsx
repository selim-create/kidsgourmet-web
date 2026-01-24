'use client';

import Link from 'next/link';

export default function BasvuruFormuPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Hero Section - Yazdırırken Gizlenir */}
      <div className="bg-white border-b border-gray-100 py-12 print:hidden">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Veri Sahibi Başvuru Formu</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Veri Sahibi Başvuru Formu</h1>
              <p className="text-gray-600 mt-3">KVKK kapsamında bilgi talepleriniz için başvuru formu</p>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors font-semibold shadow-sm"
            >
              <i className="fa-solid fa-print"></i>
              Formu Yazdır / PDF İndir
            </button>
          </div>
        </div>
      </div>
      
      {/* Content - A4 Formatı Simülasyonu */}
      <div className="max-w-[210mm] mx-auto p-4 md:py-12 print:p-0 print:w-full print:max-w-none">
        <div className="bg-white rounded-none md:rounded-2xl shadow-sm md:shadow-lg border border-gray-200 p-8 md:p-12 print:shadow-none print:border-none print:p-0">
          
          {/* Form Başlığı */}
          <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold text-black uppercase">VERİ SAHİBİ BAŞVURU FORMU</h1>
          </div>

          {/* 1. Genel Bilgiler */}
          <div className="mb-6">
            <h3 className="font-bold text-black uppercase mb-2 border-b border-gray-300">1. Genel Bilgiler</h3>
            <p className="text-sm text-gray-800 leading-relaxed text-justify">
              İşbu başvuru formu, 6698 Sayılı Kişisel Verilerin Korunması Kanunu’nda (“KVKK”) ilgili kişi olarak tanımlanan kişisel veri sahiplerinin (“Veri Sahibi”), KVKK’nın 11. maddesinde düzenlenen haklarını kullanabilmesi ve bu hakları kullanmak için Veri Sorumlusu olarak HİP Medya’ya (“HİP Medya”) başvuru şeklinin mevzuata uygun şekilde düzenlenmesi amacıyla oluşturulmuştur.
            </p>
          </div>

          {/* 2. Başvuru Yöntemi */}
          <div className="mb-6">
            <h3 className="font-bold text-black uppercase mb-2 border-b border-gray-300">2. Başvuru Yöntemi</h3>
            <div className="border border-black text-xs md:text-sm">
              <div className="grid grid-cols-3 border-b border-black font-bold bg-gray-100 print:bg-gray-100">
                <div className="p-2 border-r border-black">BAŞVURU YÖNTEMİ</div>
                <div className="p-2 border-r border-black">BAŞVURU ADRESİ</div>
                <div className="p-2">BAŞVURU AÇIKLAMASI</div>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <div className="p-2 border-r border-black font-semibold">Yazılı Başvuru</div>
                <div className="p-2 border-r border-black">Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</div>
                <div className="p-2">Zarfın üzerine "Kişisel Verilerin Korunması Kanunu Bilgi Talebi" yazınız.</div>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <div className="p-2 border-r border-black font-semibold">E-Posta Yoluyla Başvuru</div>
                <div className="p-2 border-r border-black">iletisim@kidsgourmet.com.tr</div>
                <div className="p-2">E-posta konu kısmına "Kişisel Verilerin Korunması Kanunu Bilgi Talebi" yazınız.</div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-2 border-r border-black font-semibold">Telefon</div>
                <div className="p-2 border-r border-black">0 (850) 450 11 05</div>
                <div className="p-2">-</div>
              </div>
            </div>
          </div>

          {/* 3. Kimlik ve İletişim Bilgileri */}
          <div className="mb-6">
            <h3 className="font-bold text-black uppercase mb-2 border-b border-gray-300">3. Kimlik ve İletişim Bilgileri</h3>
            <p className="text-xs text-gray-600 mb-4 print:hidden">
              * Bu alanları çıktısını aldıktan sonra doldurabilir veya dijital olarak doldurup yazdırabilirsiniz.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <label className="font-semibold text-black mb-1">Ad - Soyad:</label>
                <input type="text" className="border-b border-black border-t-0 border-x-0 bg-transparent focus:ring-0 px-0 py-1" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-black mb-1">T.C. Kimlik / Pasaport No:</label>
                <input type="text" className="border-b border-black border-t-0 border-x-0 bg-transparent focus:ring-0 px-0 py-1" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="font-semibold text-black mb-1">Adres:</label>
                <input type="text" className="border-b border-black border-t-0 border-x-0 bg-transparent focus:ring-0 px-0 py-1" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-black mb-1">Cep Telefonu:</label>
                <input type="text" className="border-b border-black border-t-0 border-x-0 bg-transparent focus:ring-0 px-0 py-1" />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-black mb-1">E-posta Adresi:</label>
                <input type="text" className="border-b border-black border-t-0 border-x-0 bg-transparent focus:ring-0 px-0 py-1" />
              </div>
            </div>
          </div>

          {/* 4. Talep Konusu */}
          <div className="mb-6 break-inside-avoid">
            <h3 className="font-bold text-black uppercase mb-2 border-b border-gray-300">4. Talep Konusu</h3>
            <div className="border border-black text-xs">
              <div className="grid grid-cols-[40px_1fr_1fr] border-b border-black font-bold bg-gray-100 print:bg-gray-100">
                <div className="p-2 border-r border-black text-center">No</div>
                <div className="p-2 border-r border-black">Talep Konusu</div>
                <div className="p-2">Açıklama / Tercih</div>
              </div>

              {/* Maddeler */}
              {[
                "HİP Medya tarafından kişisel verilerimin işlenip işlenmediği konusunda bilgi talep ediyorum.",
                "Kişisel verilerim işleniyor ise işleme faaliyeti hakkında bilgi talep ediyorum.",
                "Kişisel verilerim işleniyor ise veri işleme faaliyetinin amacı ve faaliyetin işleme amacına uygun kullanılıp kullanılmadığı hakkında bilgi talep ediyorum.",
                "Kişisel verilerimin yurtiçinde veya yurtdışında üçüncü kişilere aktarılıp aktarılmadığı ve aktarılıyor ise aktarılan kişiler hakkında bilgi talep ediyorum.",
                "Kişisel verilerimin eksik veya yanlış işlendiğini düşünüyorum ve düzeltilmesini talep ediyorum. (Doğru bilgileri açıklama kısmına yazınız ve belge ekleyiniz.)",
                "Kişisel verilerimin işlenme sebeplerinin ortadan kalktığını düşünüyorum. Silinmesini veya Anonim hale getirilmesi talep ediyorum.",
                "Eksik ve yanlış işlendiğini düşündüğüm kişisel verilerimin aktarıldığı üçüncü kişiler nezdinde de düzeltilmesini istiyorum.",
                "Kişisel verilerimin işlenme sebeplerinin ortadan kalktığını düşünüyorum, aktarıldığı üçüncü kişiler nezdinde de silinmesini istiyorum.",
                "HİP Medya tarafından işlenen kişisel verilerimin münhasıran otomatik sistemler vasıtasıyla analiz edildiğini düşünüyor ve sonucuna itiraz ediyorum.",
                "Kişisel verilerimin kanuna aykırı işlenmesi nedeniyle uğradığım zararın giderilmesini talep ediyorum.",
                "Diğer (Lütfen açıklayınız)"
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-[40px_1fr_1fr] border-b border-black last:border-b-0 min-h-[40px]">
                  <div className="p-2 border-r border-black text-center flex items-center justify-center font-semibold">{index + 1}</div>
                  <div className="p-2 border-r border-black flex items-center">{item}</div>
                  <div className="p-2 flex items-start">
                    <textarea rows={2} className="w-full h-full min-h-[40px] border-none bg-transparent resize-none text-xs focus:ring-0 p-0" placeholder="Açıklama..."></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Beyan ve İmza */}
          <div className="break-inside-avoid">
            <h3 className="font-bold text-black uppercase mb-2 border-b border-gray-300">5. Beyan ve İmza</h3>
            <p className="text-xs text-justify mb-4">
              İşbu başvuruda tarafınıza sağlamış olduğum bilgi ve belgelerimin doğru ve güncel olduğunu, HİP Medya'nın başvurumu sonuçlandırabilmek adına ilave bilgi talep edebileceğini ve ayrıca bir maliyet gerektirmesi halinde KVK Kurulu tarafından belirlenen ücreti ödemem gerekebileceği hususunda aydınlatıldığımı beyan ve taahhüt ederim.
            </p>
            
            <div className="mb-4">
              <p className="font-bold text-sm mb-2">Başvuru cevabının;</p>
              <div className="space-y-1 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-black focus:ring-0" />
                  <span>Adresime gönderilmesini talep ediyorum.</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-black focus:ring-0" />
                  <span>E-posta adresime gönderilmesini talep ediyorum.</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-black focus:ring-0" />
                  <span>Faks numarama gönderilmesini talep ediyorum.</span>
                </label>
              </div>
            </div>

            <div className="border-t-2 border-black pt-4 mt-8 flex justify-between items-end">
              <div className="text-sm">
                <p><strong>Başvuruda Bulunan İlgili Kişi (Veri Sahibi)</strong></p>
                <div className="mt-4 space-y-2">
                  <p>Adı Soyadı: ...........................................................</p>
                  <p>Başvuru Tarihi: ..... / ..... / 20.....</p>
                </div>
              </div>
              <div className="text-center pr-12">
                <p className="font-bold mb-8">İmza</p>
                <div className="w-32 border-b border-black"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Print Styles fixed to avoid hydration mismatch */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            margin: 10mm;
            size: A4;
          }
          body {
            background: white;
            color: black;
          }
          /* Hide generic Layout components if they use standard classes not covered by 'print:hidden' */
          header, footer, nav {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}