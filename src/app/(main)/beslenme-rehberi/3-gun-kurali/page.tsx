export default function ThreeDayRulePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          <i className="fa-solid fa-calendar-check text-green-500 mr-3"></i>
          3 Gün Kuralı Nedir?
        </h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-lg text-gray-700 mb-6">
            3 gün kuralı, bebeğinize yeni bir besin tanıtırken olası alerjik reaksiyonları 
            tespit edebilmek için kullanılan güvenli bir yöntemdir.
          </p>
          
          <h2 className="text-xl font-bold text-slate-800 mb-4">Nasıl Uygulanır?</h2>
          <ol className="space-y-4 mb-8">
            <li className="flex gap-4">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-bold text-slate-800">Tek Besin</p>
                <p className="text-gray-600">Her seferinde sadece bir yeni besin tanıtın.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-bold text-slate-800">3 Gün Bekleyin</p>
                <p className="text-gray-600">Yeni besini verdikten sonra 3 gün boyunca başka yeni besin eklemeyin.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-bold text-slate-800">Gözlemleyin</p>
                <p className="text-gray-600">Döküntü, kusma, ishal veya davranış değişikliklerini takip edin.</p>
              </div>
            </li>
          </ol>
          
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <h3 className="font-bold text-red-700 mb-2">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              Dikkat Edilmesi Gerekenler
            </h3>
            <ul className="text-sm text-red-600 space-y-1">
              <li>• Herhangi bir alerjik reaksiyon belirtisinde hemen doktorunuza başvurun</li>
              <li>• Yüksek alerjen riskli besinlerde ekstra dikkatli olun</li>
              <li>• Aile geçmişinde alerji varsa mutlaka doktorunuza danışın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
