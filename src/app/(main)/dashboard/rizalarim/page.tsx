"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import Link from 'next/link';
import { fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

// API'den gelen consent record tipi
interface ConsentRecord {
  id: number;
  consent_type: 'terms' | 'marketing' | 'sensitive_data' | 'guardian_declaration';
  consented: boolean;
  consented_at: string | null;
  revoked_at: string | null;
  version: string | null;
  created_at: string;
  updated_at: string;
}

interface ConsentStatus {
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  marketing_consent: boolean;
  marketing_consent_at: string | null;
  sensitive_data_consent: boolean;
  sensitive_data_consent_at: string | null;
  guardian_declaration: boolean;
  guardian_declaration_at: string | null;
}

// Default empty consent state
const DEFAULT_CONSENTS: ConsentStatus = {
  terms_accepted: false,
  terms_accepted_at: null,
  marketing_consent: false,
  marketing_consent_at: null,
  sensitive_data_consent: false,
  sensitive_data_consent_at: null,
  guardian_declaration: false,
  guardian_declaration_at: null,
};

export default function ConsentManagementPage() {
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const [consents, setConsents] = useState<ConsentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [consentToRevoke, setConsentToRevoke] = useState<'marketing_consent' | 'sensitive_data_consent' | null>(null);

  useEffect(() => {
    if (isAuthenticated && !userLoading) {
      fetchConsents();
    }
  }, [isAuthenticated, userLoading]);

  useEffect(() => {
    const handleCookieConsentUpdate = () => {
      // Cookie consent güncellendiğinde sayfa yenilenir
      if (isAuthenticated) {
        fetchConsents();
      }
    };

    window.addEventListener('cookieConsentUpdate', handleCookieConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdate', handleCookieConsentUpdate);
  }, [isAuthenticated]);

  const fetchConsents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAuthAPI<ConsentRecord[]>(API_ENDPOINTS.USER_CONSENTS, {}, [404]);
      
      // Array yanıtını object'e dönüştür
      const transformedConsents: ConsentStatus = { ...DEFAULT_CONSENTS };
      
      if (Array.isArray(data)) {
        data.forEach(consent => {
          switch (consent.consent_type) {
            case 'terms':
              transformedConsents.terms_accepted = consent.consented;
              transformedConsents.terms_accepted_at = consent.consented_at;
              break;
            case 'marketing':
              transformedConsents.marketing_consent = consent.consented;
              transformedConsents.marketing_consent_at = consent.consented_at;
              break;
            case 'sensitive_data':
              transformedConsents.sensitive_data_consent = consent.consented;
              transformedConsents.sensitive_data_consent_at = consent.consented_at;
              break;
            case 'guardian_declaration':
              transformedConsents.guardian_declaration = consent.consented;
              transformedConsents.guardian_declaration_at = consent.consented_at;
              break;
          }
        });
      }
      
      setConsents(transformedConsents);
    } catch (error) {
      // 404 hatası sessizce ele alınacak - yeni kullanıcılarda normal
      if ((error as any)?.errorInfo?.statusCode !== 404) {
        console.error('Error fetching consents:', error);
        toast.error('Rıza bilgileri yüklenirken hata oluştu');
      }
      // Hata durumunda boş consent state'i set et
      setConsents({ ...DEFAULT_CONSENTS });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantConsent = async (type: 'terms' | 'marketing' | 'sensitive_data' | 'guardian_declaration') => {
    try {
      await fetchAuthAPI(API_ENDPOINTS.USER_CONSENT_UPDATE(type), {
        method: 'PUT',
        body: JSON.stringify({ consented: true }),
      });
      toast.success('Rızanız başarıyla onaylandı');
      await fetchConsents();
    } catch (error) {
      console.error('Error granting consent:', error);
      toast.error('Rıza onaylanırken hata oluştu');
    }
  };

  const handleRevokeConsent = async () => {
    if (!consentToRevoke) return;

    // Consent tipini API formatına dönüştür
    const consentTypeMap: Record<typeof consentToRevoke, string> = {
      'marketing_consent': 'marketing',
      'sensitive_data_consent': 'sensitive_data',
    };

    const apiConsentType = consentTypeMap[consentToRevoke];

    if (!apiConsentType) {
      console.error('Invalid consent type:', consentToRevoke);
      return;
    }

    try {
      await fetchAuthAPI(API_ENDPOINTS.USER_CONSENT_UPDATE(apiConsentType), {
        method: 'PUT',
        body: JSON.stringify({ consented: false }),
      });

      toast.success('Rızanız başarıyla geri çekildi');
      await fetchConsents();
      setShowConfirmModal(false);
      setConsentToRevoke(null);
    } catch (error) {
      console.error('Error revoking consent:', error);
      toast.error('Rıza geri çekilirken hata oluştu');
    }
  };

  const openRevokeModal = (type: 'marketing_consent' | 'sensitive_data_consent') => {
    setConsentToRevoke(type);
    setShowConfirmModal(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <i className="fa-solid fa-lock text-gray-400 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Giriş Gerekli</h2>
          <p className="text-slate-600 mb-6">
            Rıza yönetimi sayfasını görüntülemek için giriş yapmalısınız.
          </p>
          <Link
            href="/login"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-orange-500 text-4xl mb-4"></i>
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Geri dön linki */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 mb-4 transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            Ebeveyn Paneline Dön
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Rıza Yönetimi</h1>
        </div>

        {/* Consents List */}
        <div className="space-y-4">
          {/* Terms of Service - Non-revocable */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-file-contract text-blue-500 text-xl"></i>
                  <h3 className="font-bold text-slate-800">Kullanım Koşulları ve Gizlilik Politikası</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Platformu kullanabilmek için gerekli olan temel sözleşme ve politikalar.
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    consents?.terms_accepted 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <i className={`fa-solid ${consents?.terms_accepted ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    {consents?.terms_accepted ? 'Onaylandı' : 'Onaylanmadı'}
                  </span>
                  {consents?.terms_accepted && (
                    <span className="text-xs text-gray-500">
                      {formatDate(consents.terms_accepted_at)}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {!consents?.terms_accepted && (
                  <button
                    onClick={() => handleGrantConsent('terms')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Onayla
                  </button>
                )}
                {consents?.terms_accepted && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <i className="fa-solid fa-lock"></i>
                    Geri Çekilemez
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <i className="fa-solid fa-info-circle mr-1"></i>
                Bu rıza platformu kullanabilmek için zorunludur. Hesabınızı silmek isterseniz Profil Ayarları bölümünden hesap silme işlemi yapabilirsiniz.
              </p>
            </div>
          </div>

          {/* Marketing Consent - Revocable */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-envelope text-purple-500 text-xl"></i>
                  <h3 className="font-bold text-slate-800">Pazarlama İletişimi</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Kampanya, tanıtım ve bilgilendirme e-postaları almak için verilen rıza.
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    consents?.marketing_consent 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <i className={`fa-solid ${consents?.marketing_consent ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    {consents?.marketing_consent ? 'Onaylandı' : 'Onaylanmadı'}
                  </span>
                  {consents?.marketing_consent && (
                    <span className="text-xs text-gray-500">
                      {formatDate(consents.marketing_consent_at)}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {!consents?.marketing_consent && (
                  <button
                    onClick={() => handleGrantConsent('marketing')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Onayla
                  </button>
                )}
                {consents?.marketing_consent && (
                  <button
                    onClick={() => openRevokeModal('marketing_consent')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    <i className="fa-solid fa-ban mr-2"></i>
                    Geri Çek
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sensitive Data Consent - Revocable */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-heart-pulse text-orange-500 text-xl"></i>
                  <h3 className="font-bold text-slate-800">Sağlık ve Gelişim Verileri</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Çocuğunuza ait sağlık ve gelişim verilerinin işlenmesi için verilen açık rıza.
                  Detaylı bilgi için{' '}
                  <Link href="/acik-riza-metni" className="text-orange-500 hover:underline font-medium">
                    Açık Rıza Metni
                  </Link>
                  'ne bakabilirsiniz.
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    consents?.sensitive_data_consent 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <i className={`fa-solid ${consents?.sensitive_data_consent ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    {consents?.sensitive_data_consent ? 'Onaylandı' : 'Onaylanmadı'}
                  </span>
                  {consents?.sensitive_data_consent && (
                    <span className="text-xs text-gray-500">
                      {formatDate(consents.sensitive_data_consent_at)}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {!consents?.sensitive_data_consent && (
                  <button
                    onClick={() => handleGrantConsent('sensitive_data')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Onayla
                  </button>
                )}
                {consents?.sensitive_data_consent && (
                  <button
                    onClick={() => openRevokeModal('sensitive_data_consent')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    <i className="fa-solid fa-ban mr-2"></i>
                    Geri Çek
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Guardian Declaration - Non-revocable */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-user-shield text-blue-500 text-xl"></i>
                  <h3 className="font-bold text-slate-800">Veli/Vasi Beyanı</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  18 yaşından büyük olduğunuz ve yasal veli/vasi sıfatıyla çocuk bilgilerini paylaştığınıza dair beyan.
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    consents?.guardian_declaration 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <i className={`fa-solid ${consents?.guardian_declaration ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    {consents?.guardian_declaration ? 'Beyan Edildi' : 'Beyan Edilmedi'}
                  </span>
                  {consents?.guardian_declaration && (
                    <span className="text-xs text-gray-500">
                      {formatDate(consents.guardian_declaration_at)}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {/* Veli/Vasi beyanı manuel olarak onaylanamaz - sadece bilgilendirici */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <i className="fa-solid fa-info-circle"></i>
                  {consents?.guardian_declaration ? 'Geri Çekilemez' : 'Çocuk Ekleyince Otomatik'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <i className="fa-solid fa-info-circle mr-1"></i>
                {consents?.guardian_declaration 
                  ? 'Bu beyan çocuk profili eklediğinizde otomatik olarak alınmıştır ve geri çekilemez.'
                  : 'Bu beyan, çocuk profili eklediğinizde otomatik olarak alınacaktır.'}
              </p>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-info-circle"></i>
            KVKK Hakları Hakkında
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında sahip olduğunuz haklar için{' '}
              <Link href="/kvkk" className="font-bold hover:underline">
                KVKK Aydınlatma Metni
              </Link>
              'ni inceleyebilirsiniz.
            </p>
            <p>
              Verilerinizin silinmesi, düzeltilmesi veya diğer haklarınızı kullanmak için{' '}
              <Link href="/iletisim" className="font-bold hover:underline">
                İletişim
              </Link>
              {' '}sayfasından bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Rızayı Geri Çek</h3>
              <p className="text-slate-600">
                {consentToRevoke === 'marketing_consent' 
                  ? 'Pazarlama iletişimi rızanızı geri çekmek istediğinizden emin misiniz? Artık kampanya ve tanıtım e-postaları almayacaksınız.'
                  : 'Sağlık ve gelişim verileri rızanızı geri çekmek istediğinizden emin misiniz? Bu, kişiselleştirilmiş önerileri etkileyebilir.'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConsentToRevoke(null);
                }}
                className="flex-1 bg-gray-200 text-slate-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleRevokeConsent}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                Geri Çek
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
