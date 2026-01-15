// Navigation data structure for KidsGourmet header

export interface NavSubItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  color?: string; // Hover color for the menu item
  children?: NavSubItem[];
}

export const navigationItems: NavItem[] = [
  {
    label: 'Tarifler',
    href: '/tarifler',
    icon: 'fa-solid fa-utensils',
    color: 'orange',
    children: [
      { 
        label: 'Hazırlık Evresi (0-6 Ay)', 
        href: '/tarifler?age-group=0-6-ay', 
        icon: 'fa-solid fa-baby' 
      },
      { 
        label: 'Başlangıç & Tadım (6-8 Ay)', 
        href: '/tarifler?age-group=6-8-ay', 
        icon: 'fa-solid fa-spoon' 
      },
      { 
        label: 'Keşif & Pütürlüye Geçiş (9-11 Ay)', 
        href: '/tarifler?age-group=9-11-ay', 
        icon: 'fa-solid fa-bowl-food' 
      },
      { 
        label: 'Aile Sofrasına Geçiş (12-24 Ay)', 
        href: '/tarifler?age-group=12-24-ay', 
        icon: 'fa-solid fa-users' 
      },
      { 
        label: 'Çocuk Gurme (2+ Yaş)', 
        href: '/tarifler?age-group=2-yas-uzeri', 
        icon: 'fa-solid fa-child' 
      },
    ],
  },
  {
    label: 'Beslenme Rehberi',
    href: '/beslenme-rehberi',
    icon: 'fa-solid fa-apple-whole',
    color: 'green',
    children: [
      { 
        label: 'Sunum Önerileri', 
        href: '/beslenme-rehberi/sunum-onerileri', 
        icon: 'fa-solid fa-plate-wheat' 
      },
      { 
        label: 'Ek Gıda Rehberi', 
        href: '/akilli-asistan/ek-gida-rehberi', 
        icon: 'fa-solid fa-carrot' 
      },
      { 
        label: 'Ek Gıdaya Başlama Kontrolü', 
        href: '/akilli-asistan/ek-gidaya-baslama', 
        icon: 'fa-solid fa-clipboard-check' 
      },
      { 
        label: '3 Gün Kuralı', 
        href: '/beslenme-rehberi/3-gun-kurali', 
        icon: 'fa-solid fa-clock-rotate-left' 
      },
      { 
        label: 'Bu Gıda Verilir mi?', 
        href: '/akilli-asistan/bu-gida-verilir-mi', 
        icon: 'fa-solid fa-circle-question' 
      },
      { 
        label: 'Besin Deneme Takvimi', 
        href: '/akilli-asistan/besin-takvimi', 
        icon: 'fa-solid fa-calendar-check' 
      },
    ],
  },
  {
    label: 'Akıllı Asistan',
    href: '/akilli-asistan',
    icon: 'fa-solid fa-wand-magic-sparkles',
    color: 'blue',
    children: [
      { 
        label: 'BLW Hazırlık Testi', 
        href: '/akilli-asistan/blw-testi', 
        icon: 'fa-solid fa-baby' 
      },
      { 
        label: 'Persentil Hesaplayıcı', 
        href: '/akilli-asistan/persentil', 
        icon: 'fa-solid fa-chart-line' 
      },
      { 
        label: 'Su İhtiyacı Hesaplayıcı', 
        href: '/akilli-asistan/su-ihtiyaci', 
        icon: 'fa-solid fa-glass-water' 
      },
      { 
        label: 'Alerjen Deneme Planlayıcı', 
        href: '/akilli-asistan/alerjen-planlayici', 
        icon: 'fa-solid fa-shield-heart' 
      },
      { 
        label: 'Banyo Rutini Planlayıcı', 
        href: '/akilli-asistan/banyo-planlayici', 
        icon: 'fa-solid fa-bath' 
      },
      { 
        label: 'Günlük Hijyen Hesaplayıcı', 
        href: '/akilli-asistan/hijyen-hesaplayici', 
        icon: 'fa-solid fa-hand-sparkles' 
      },
      { 
        label: 'Akıllı Bez Hesaplayıcı', 
        href: '/akilli-asistan/bez-hesaplayici', 
        icon: 'fa-solid fa-baby-carriage' 
      },
      { 
        label: 'Hava Kalitesi Rehberi', 
        href: '/akilli-asistan/hava-kalitesi', 
        icon: 'fa-solid fa-wind' 
      },
      { 
        label: 'Leke Ansiklopedisi', 
        href: '/akilli-asistan/leke-rehberi', 
        icon: 'fa-solid fa-shirt' 
      },
    ],
  },
  {
    label: 'Keşfet',
    href: '/kesfet',
    icon: 'fa-solid fa-compass',
    color: 'purple',
    children: [
      { 
        label: 'Anne', 
        href: '/kesfet/kategori/anne', 
        icon: 'fa-solid fa-heart' 
      },
      { 
        label: 'Hamilelik', 
        href: '/kesfet/kategori/hamilelik', 
        icon: 'fa-solid fa-person-pregnant' 
      },
      { 
        label: 'Bebek', 
        href: '/kesfet/kategori/bebek', 
        icon: 'fa-solid fa-baby' 
      },
      { 
        label: 'Çocuk', 
        href: '/kesfet/kategori/cocuk', 
        icon: 'fa-solid fa-child-reaching' 
      },
      { 
        label: 'Sağlık', 
        href: '/kesfet/kategori/saglik', 
        icon: 'fa-solid fa-heart-pulse' 
      },
      { 
        label: 'Aile', 
        href: '/kesfet/kategori/aile', 
        icon: 'fa-solid fa-people-roof' 
      },
      { 
        label: 'Çocuk Gelişimi', 
        href: '/kesfet/kategori/cocuk-gelisimi', 
        icon: 'fa-solid fa-seedling' 
      },
      { 
        label: 'Oyun', 
        href: '/kesfet/kategori/oyun', 
        icon: 'fa-solid fa-gamepad' 
      },
    ],
  },
  {
    label: 'Topluluk',
    href: '/topluluk',
    icon: 'fa-solid fa-users',
    color: 'pink',
  },
];
