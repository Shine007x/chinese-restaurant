export type MenuCategory = 'dim-sum' | 'mains' | 'noodles' | 'roast';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  nameEn: string;
  nameMm: string;
  descriptionEn: string;
  descriptionMm: string;
  price: number; // MMK
  image?: string;
}

export const menuItems: MenuItem[] = [
  // Dim Sum
  {
    id: 'siu-mai',
    category: 'dim-sum',
    nameEn: 'Siu Mai',
    nameMm: 'ဆိုင်းမိုင်း',
    descriptionEn: 'Steamed pork dumplings with shrimp',
    descriptionMm: 'ဝက်သားနှင့်ပုစွန်ပါသော ပေါင်းထုပ်',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
  },
  {
    id: 'cheung-fun',
    category: 'dim-sum',
    nameEn: 'Cheung Fun',
    nameMm: 'ချောင်းဖန်',
    descriptionEn: 'Steamed rice noodle rolls with filling',
    descriptionMm: 'ပြည့်စုံသော ဆန်ခေါက်ဆွဲလိပ်လိပ်',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
  },
  // Mains (Wok-Fried)
  {
    id: 'sweet-sour-pork',
    category: 'mains',
    nameEn: 'Sweet & Sour Pork',
    nameMm: 'ချဉ်ချောင်းဝက်သား',
    descriptionEn: 'Crispy pork with tangy pineapple sauce',
    descriptionMm: 'နာနတ်သီးဆော့စ်ပါ ကြွပ်ကြွပ်ရှဝက်သား',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
  },
  {
    id: 'mongolian-beef',
    category: 'mains',
    nameEn: 'Mongolian Beef',
    nameMm: 'မွန်ဂိုးလီးအမဲသား',
    descriptionEn: 'Tender beef in savory brown sauce with scallions',
    descriptionMm: 'ကြက်သွန်နီပါ ချောင်းဆို့အမဲသား',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  },
  {
    id: 'lemon-chicken',
    category: 'mains',
    nameEn: 'Lemon Chicken',
    nameMm: 'သံပရာကြက်သား',
    descriptionEn: 'Crispy chicken with sweet lemon sauce',
    descriptionMm: 'သံပရာချိုဆော့စ်ပါ ကြွပ်ကြွပ်ရှကြက်သား',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
  },
  // Noodles
  {
    id: 'chow-mein',
    category: 'noodles',
    nameEn: 'Chow Mein',
    nameMm: 'ချောင်းမိုကန်',
    descriptionEn: 'Crispy pan-fried noodles with vegetables',
    descriptionMm: 'ဟင်းသီးဟင်းရွက်ပါ ကြော်ခေါက်ဆွဲ',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  },
  {
    id: 'fried-rice',
    category: 'noodles',
    nameEn: 'Yangon Fried Rice',
    nameMm: 'ရန်ကုန်ကြော်ထမင်း',
    descriptionEn: 'Wok-fried rice with egg, veggies, and choice of meat',
    descriptionMm: 'ဘဲဥ၊ ဟင်းသီးဟင်းရွက်နှင့်အသားပါ ကြော်ထမင်း',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
  },
  {
    id: 'wonton-noodles',
    category: 'noodles',
    nameEn: 'Wonton Noodles',
    nameMm: 'ဝမ်တုန်းခေါက်ဆွဲ',
    descriptionEn: 'Egg noodles with wonton dumplings in broth',
    descriptionMm: 'ဝမ်တုန်းထုပ်ပါ ခေါက်ဆွဲဟင်းရည်',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
  },
  {
    id: 'singapore-noodles',
    category: 'noodles',
    nameEn: 'Singapore Noodles',
    nameMm: 'စင်္ကာပူခေါက်ဆွဲ',
    descriptionEn: 'Curry-flavored rice vermicelli with shrimp and BBQ pork',
    descriptionMm: 'ပုစွန်နှင့်ချာဆူးပါ ခရမ်းမှုန့်ခေါက်ဆွဲ',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop',
  },
  // Roast
  {
    id: 'char-siu',
    category: 'roast',
    nameEn: 'Char Siu',
    nameMm: 'ချာဆူးဝက်သားကင်',
    descriptionEn: 'BBQ roasted pork with honey glaze',
    descriptionMm: 'ပျားရည်ဖြင့်ကင်ထားသော ဝက်သား',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
  },
  {
    id: 'roast-duck',
    category: 'roast',
    nameEn: 'Roast Duck',
    nameMm: 'ဘဲကင်',
    descriptionEn: 'Crispy-skinned roasted duck',
    descriptionMm: 'ကြွပ်ကြွပ်ရှအရေပြားပါ ဘဲကင်',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop',
  },
  {
    id: 'peking-duck',
    category: 'roast',
    nameEn: 'Peking Duck',
    nameMm: 'ပက်ကင်းဘဲကင်',
    descriptionEn: 'Crispy duck with pancakes and hoisin sauce',
    descriptionMm: 'မုန့်ပြားနှင့်ဟွိုင်ဆင်းဆော့စ်ပါ ဘဲကင်',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop',
  },
  {
    id: 'soy-sauce-chicken',
    category: 'roast',
    nameEn: 'Soy Sauce Chicken',
    nameMm: 'ပဲငံပြာရည်ကြက်သား',
    descriptionEn: 'Tender chicken braised in soy sauce',
    descriptionMm: 'ပဲငံပြာရည်ဖြင့်ချက်ထားသော ကြက်သား',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
  },
];

export const menuCategories: { slug: MenuCategory; nameEn: string; nameMm: string }[] = [
  { slug: 'dim-sum', nameEn: 'Dim Sum', nameMm: 'ဒင်ဆမ်' },
  { slug: 'mains', nameEn: 'Wok-Fried Classics', nameMm: 'ဝေါ့ကြော်ထားသော ရိုးရာဟင်းလျာများ' },
  { slug: 'noodles', nameEn: 'Noodles & Rice', nameMm: 'ခေါက်ဆွဲနှင့်ထမင်း' },
  { slug: 'roast', nameEn: 'Roast Specialties', nameMm: 'ကင်ထားသော အထူးဟင်းလျာများ' },
];
