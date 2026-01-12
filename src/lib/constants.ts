// WordPress sitenizin adresi (Localde veya Canlıda)
// .env.local dosyasında NEXT_PUBLIC_WORDPRESS_API_URL tanımlamayı unutmayın.
export const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://api.kidsgourmet.com.tr/wp-json';

// Özel Namespace'imiz (Backend'de tanımladığımız)
export const KG_API_NAMESPACE = '/kg/v1';
export const WP_API_NAMESPACE = '/wp/v2';