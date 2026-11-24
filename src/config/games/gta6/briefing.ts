export type BriefBlock = {
  id: string
  title: { en: string; tr: string }
  body: { en: string; tr: string }[]
}

/** Facts taken from the public guide. Not a walkthrough. */
export const GTA6_BRIEFING: BriefBlock[] = [
  {
    id: 'cast',
    title: { en: 'People', tr: 'Kişiler' },
    body: [
      {
        en: 'The story is Jason Duval and Lucia Caminos in the state of Leonida.',
        tr: 'Hikaye, Leonida eyaletinde Jason Duval ve Lucia Caminos’un hikayesi.',
      },
      {
        en: 'Lucia Caminos (Manni L. Perez) leaves Hamlet Correctional and teams up with Jason. Jason Duval (Dylan Rourke) is from Ambrosia, ex-Army, and works for Brian Heder in the Keys.',
        tr: 'Lucia Caminos (Manni L. Perez) Hamlet Correctional’dan çıkar ve Jason ile çalışır. Jason Duval (Dylan Rourke) Ambrosia’lıdır, ordudan gelmiştir ve Keys’te Brian Heder için çalışır.',
      },
      {
        en: 'Brian Heder (Stephen Root) runs product through his boat yard with Lori. Cal Hampton works with Jason at the boatworks. Andy is Lucia’s friend. Vicki Wallis works at Delights Cabaret in Port Gellhorn. Moses Watkins runs a chop shop there. Dunk is another Port Gellhorn local. Wyman is the off-grid mechanic tied to the Ultimate Edition cars.',
        tr: 'Brian Heder (Stephen Root) ürünü, Lori ile birlikte tekne sahasından geçirir. Cal Hampton, Jason ile boatworks’te çalışır. Andy, Lucia’nın arkadaşıdır. Vicki Wallis, Port Gellhorn’daki Delights Cabaret’te çalışır. Moses Watkins orada bir chop shop işletir. Dunk da Port Gellhorn’dandır. Wyman, Ultimate Edition arabalarına bağlanan şebekeden kopuk tamircidir.',
      },
      {
        en: 'Chapter 3 moves into Vice City around Boobie Ike, Dre’Quan Priest, Raul, Tyrone, and Lucia’s mother Mia. The chapter title is Tits Ass Drugs Money and the open guide lists 27 story missions ending at The Cartel Heist.',
        tr: '3. bölüm Vice City’de Boobie Ike, Dre’Quan Priest, Raul, Tyrone ve Lucia’nın annesi Mia çevresinde ilerler. Bölüm adı Tits Ass Drugs Money’dir; açık rehber The Cartel Heist ile biten 27 hikaye görevi sayar.',
      },
    ],
  },
  {
    id: 'focus',
    title: { en: 'Focus', tr: 'Focus' },
    body: [
      {
        en: 'Focus is the same ability for both characters. Click both sticks together. Out of combat it lasts about 30 seconds on foot and does not drain while you are only looking around. Driving shortens it as speed rises, down toward 10 seconds.',
        tr: 'Focus iki karakterde de aynı yetenektir. İki çubuğa birden bas. Çatışma dışında, yaya olarak yaklaşık 30 saniye sürer ve yalnızca etrafa bakarken tükenmez. Sürüşte hız arttıkça kısalır, 10 saniyeye kadar düşebilir.',
      },
      {
        en: 'White marks doors and consumables, red marks enemies, explosives, and alarms, purple marks drugs a fence will buy, and green marks cash.',
        tr: 'Beyaz kapı ve tüketilebilirleri, kırmızı düşman, patlayıcı ve alarmları, mor bir alıcının alacağı uyuşturucuyu, yeşil de nakitı işaretler.',
      },
    ],
  },
  {
    id: 'heat',
    title: { en: 'Wanted and heat', tr: 'Aranma ve heat' },
    body: [
      {
        en: 'Stars follow what gets reported, not every crime you commit unseen. Gray stars mean police are responding and have not seen you. White stars mean they have you in sight. Red stars mean they lost you but the area is still hot. A red outline means the description no longer matches you.',
        tr: 'Yıldızlar, işlenen her suçu değil, ihbar edileni izler. Gri yıldız, polisin yolda olduğunu ve seni görmediğini söyler. Beyaz yıldız, seni gördüklerini söyler. Kırmızı yıldız, seni kaybettiklerini ama bölgenin hâlâ sıcak olduğunu söyler. Kırmızı çerçeve, tarifin artık sana uymadığını söyler.',
      },
      {
        en: 'There are six star levels. The police scanner unlocks in an early Chapter 1 mission. Heat icons under the stars show how they are still identifying you.',
        tr: 'Altı yıldız seviyesi vardır. Polis tarayıcısı 1. bölümün erken bir görevinde açılır. Yıldızların altındaki heat simgeleri, seni hâlâ nasıl teşhis ettiklerini gösterir.',
      },
    ],
  },
  {
    id: 'profile',
    title: { en: 'Criminal profile', tr: 'Suç profili' },
    body: [
      {
        en: 'Jason and Lucia each have their own profile: Professional, Hardened, Violent, Psycho, or Irredeemable. Irredeemable does not come back. Open the map, tab to Jason & Lucia, then look left for Jason and right for Lucia.',
        tr: 'Jason ve Lucia’nın profilleri ayrıdır: Professional, Hardened, Violent, Psycho veya Irredeemable. Irredeemable geri dönmez. Haritayı aç, Jason & Lucia sekmesine geç, Jason için sola, Lucia için sağa bak.',
      },
      {
        en: 'Non-lethal takedowns and quieter jobs support the higher profiles and can add Focus. Killing police or bystanders pushes the profile down.',
        tr: 'Ölümcül olmayan etkisizleştirmeler ve daha sessiz işler üst profilleri tutar ve Focus ekleyebilir. Polis ya da yayanın ölmesi profili aşağı iter.',
      },
    ],
  },
  {
    id: 'relationship',
    title: { en: 'Jason and Lucia', tr: 'Jason ve Lucia' },
    body: [
      {
        en: 'Their relationship changes dialogue and some scenes. It is not a second 100% bar. Choices in missions and how you treat each other move it.',
        tr: 'İlişkileri diyaloğu ve bazı sahneleri değiştirir. Bu ikinci bir %100 çubuğu değildir. Görev seçimleri ve birbirine davranış onu oynatır.',
      },
    ],
  },
  {
    id: 'fitness',
    title: { en: 'Fitness', tr: 'Form' },
    body: [
      {
        en: 'Strength, cardio, and Focus each have four levels and decay if you stop training. The phone’s Fitness app tracks calories, sleep, and the workout window. Training one character does not train the other. Jason starts at Strength level three. The Key Lento safehouse has an early weight set.',
        tr: 'Güç, kardiyo ve Focus’un dörder seviyesi vardır ve antrenman kesilirse düşer. Telefonun Fitness uygulaması kalori, uyku ve antrenman penceresini tutar. Bir karakteri çalıştırmak diğerini çalıştırmaz. Jason, güç seviyesi üçle başlar. Key Lento güvenli evinde erken bir ağırlık seti vardır.',
      },
    ],
  },
  {
    id: 'phone',
    title: { en: 'Phone', tr: 'Telefon' },
    body: [
      {
        en: 'Contacts, camera, gallery, news, and weather are on the phone from the start. WhatUp holds messages. Scooter Bros delivers a car for a fee; Scooter Bros Premium is $12,500 and can fetch a wanted car before it is impounded. RydeMe is a paid ride, and skipping the journey on rideshare or cabs costs $50 extra. Buses and trains can also skip to a stop on that line. BuckMe is the bank, and cash still goes in through an ATM. Snapmatic is the social feed. WAiNK scans landmarks, curiosities, sculptures, billboards, and tags. Vice City Real Estate sells garages. The cop scanner and key cloner arrive later as plugins.',
        tr: 'Kişiler, kamera, galeri, haber ve hava durumu baştan telefondadır. WhatUp mesajları tutar. Scooter Bros ücretle araba getirir; Scooter Bros Premium 12.500 $’dır ve aranan arabayı çekilmeden önce getirebilir. RydeMe ücretli yolculuktur; yolculuğu atlamak taksi veya rideshare’de ekstra 50 $’dır. Otobüs ve tren de o hattın durağına atlayabilir. BuckMe bankadır; nakit yine bir ATM’den yatar. Snapmatic sosyal akıştır. WAiNK simge yer, tuhaflık, heykel, pano ve tag tarar. Vice City Real Estate garaj satar. Polis tarayıcısı ve anahtar kopyalayıcı sonra eklenti olarak gelir.',
      },
    ],
  },
  {
    id: 'money',
    title: { en: 'Early money', tr: 'Erken para' },
    body: [
      {
        en: 'Illegal operations, side recoveries, and fencing product are the early cash. Deposit it through BuckMe instead of carrying it. Pay ’n’ Spray changes a vehicle’s look before a fence will take it. The guide’s 100% line wants $200,000 in vehicles fenced, and $100,000 each in narcotics, jewelry, and marked bills.',
        tr: 'Yasa dışı operasyonlar, yan toplamalar ve malı alıcıya satmak erken nakittir. Üstünde taşımak yerine BuckMe ile yatır. Pay ’n’ Spray, alıcı arabayı almadan önce görünüşünü değiştirir. Rehberin %100 satırı 200.000 $ araç, uyuşturucu, mücevher ve işaretli banknot için de 100.000’er $ satış ister.',
      },
      {
        en: 'Fences pay differently by item type. Preview the offer on the map before dumping a whole bag. Early Vice City drugs, marked bills, and jewelry keep better if you wait for Boobie’s Jason jobs to unlock local fences. Entering a shop with a bandana on alerts people even when you are not robbing.',
        tr: 'Alıcılar ürün tipine göre farklı öder. Bütün çantayı dökmeden önce haritada teklife bak. Erken Vice City uyuşturucusu, işaretli banknot ve mücevher, Boobie’nin Jason işleri yerel alıcıları açana kadar bekletilirse daha iyi satılır. Bandanalı dükkâna girmek, soymasan bile insanları uyarır.',
      },
    ],
  },
  {
    id: 'catalog',
    title: { en: 'What is counted', tr: 'Ne sayılıyor' },
    body: [
      {
        en: 'Scan 277 base models. About 280 standout vehicles sit at fixed spots. The 100% line is 200 scanned vehicles.',
        tr: '277 temel model taranır. Yaklaşık 280 standout araç sabit yerlerdedir. %100 çizgisi 200 taranmış araçtır.',
      },
      {
        en: '53 guns, 9 melee types, and 4 explosives. About 127 unique weapon variants, or 130 on the collections count, plus two with the Ultimate Edition. Holster with L1 or LB.',
        tr: '53 silah, 9 yakın dövüş tipi ve 4 patlayıcı. Benzersiz silah varyantı yaklaşık 127; koleksiyon sayımı 130, Ultimate Edition iki tane daha ekliyor. Silahı L1 veya LB ile kınına koy.',
      },
      {
        en: '18 card sets and 480 cards, 108 WAiNK scans, 112 Ahol trash pieces, 5 rooftop murals that unlock a custom ’95 Grotti Cheetah, 7 Kenton wrecks with 36 treasure pieces besides the story doubloons, 33 underwater discoveries, and 26 Ammu-Nation shops. Five 1010 murals are photographed with the phone camera, not a WAiNK scan. Card sets include Jack of Hearts, Delights, Nine1Nine, Corkers, Flamingos, Panic, Penetrators, Club de Futbol, B.A.M., America\'s Next Top Hooker, Right Wing, Ed Universe, Ratface, Swingers, Narcos, Manatees, Pounders, and Wrath.',
        tr: '18 kart seti ve 480 kart, 108 WAiNK taraması, 112 Ahol çöp parçası, özel bir ’95 Grotti Cheetah açan 5 çatı muralı, hikaye dublonlarının yanında 36 hazine parçalı 7 Kenton enkazı, 33 su altı keşfi ve 26 Ammu-Nation. Beş 1010 muralı telefon kamerasıyla çekilir. Kart setleri: Jack of Hearts, Delights, Nine1Nine, Corkers, Flamingos, Panic, Penetrators, Club de Futbol, B.A.M., America\'s Next Top Hooker, Right Wing, Ed Universe, Ratface, Swingers, Narcos, Manatees, Pounders ve Wrath.',
      },
    ],
  },
  {
    id: 'garages',
    title: { en: 'Garages', tr: 'Garajlar' },
    body: [
      {
        en: 'Registration opens with Moses in Chapter 2 for untracked cars; the first register is free. After Randy in Chapter 3, Pay ’n’ Sprays can register standard-tracker cars. Chapter 1 cars stay temporary. Scan with WAiNK before you buy or steal.',
        tr: 'Kayıt, 2. bölümde Moses ile trackersiz arabalarda açılır; ilk kayıt bedavadır. 3. bölümde Randy’den sonra Pay ’n’ Spray standart tracker’lı arabayı da kaydeder. 1. bölüm arabaları geçicidir. Almadan veya çalmadan önce WAiNK ile tara.',
      },
      {
        en: 'Owned slots start at four once registration opens. The Vice City Real Estate app, unlocked from Daily Driver, sells eight one-spot Little Boxes garages. Port Gellhorn Station is free from that mission. Thompson Court opens from Company Cars. Vanessa’s Chapter 3 laptop can add Del Rio Boulevard with a free pink Pfister Growler if solved before the chapter ends.',
        tr: 'Kayıt açılınca sahip olunan yer dörtten başlar. Daily Driver’dan açılan Vice City Real Estate uygulaması sekiz tek yuvalı Little Boxes garajı satar. Port Gellhorn Station o görevden bedavadır. Thompson Court, Company Cars’tan açılır. Vanessa’nın 3. bölüm dizüstü bilgisayarı, bölüm bitmeden çözülürse Del Rio Boulevard’ı pembe Pfister Growler ile ekler.',
      },
      {
        en: 'Published Little Boxes prices include Mitchel Auto Center $4,000, 7th Avenue $12,000, Store n’ Bolt $16,800, Wyatt Motors $21,600, Bonita Court $34,000, and Atlantic Court $40,000. Persistence Road and Vela Rota Drive still say check the app. A dearer garage buys location, not extra spots.',
        tr: 'Yayımlanmış Little Boxes fiyatları: Mitchel Auto Center 4.000 $, 7th Avenue 12.000 $, Store n’ Bolt 16.800 $, Wyatt Motors 21.600 $, Bonita Court 34.000 $, Atlantic Court 40.000 $. Persistence Road ve Vela Rota Drive hâlâ uygulamaya bak diyor. Daha pahalı garaj yer alır, ekstra yuva vermez.',
      },
    ],
  },
  {
    id: 'field',
    title: { en: 'Getting around', tr: 'İşin pratiği' },
    body: [
      {
        en: 'Zombix is $15 at convenience stores, from the clerk or the shelf, and you can carry five bottles on each character. Adrenaline is not sold. It shows up in first-aid and trauma kits.',
        tr: 'Zombix marketlerde 15 $. Tezgahtan ya da raftan alınır ve her karakter beş şişe taşır. Adrenalin satılmaz. İlk yardım ve travma çantalarında çıkar.',
      },
      {
        en: 'A motorcycle can be hotwired without breaking glass. People who see it can still call the police. Pay ’n’ Spray repairs the car, and a respray clears vehicle heat. Auto-drive needs a vehicle and a waypoint, then hold D-pad down. Control layouts are Default, Classic, and Left-handed, under Settings.',
        tr: 'Motosiklet, cam kırmadan kontaklanabilir. Gören yine polisi arayabilir. Pay ’n’ Spray arabayı tamir eder, boya da araç heat’ini siler. Otomatik sürüş için araçta ol ve bir işaret koy, sonra yön tuşunun aşağısını basılı tut. Kontrol düzenleri Default, Classic ve Left-handed. Ayarlar’dan değişir.',
      },
      {
        en: 'Fishing raises Focus. Cal’s challenge arrives in Chapter 1. Friendly animals are aimed at with L2 or LT, praised, then pet with Triangle or Y. Treats are bought at a grocery register, two at a time.',
        tr: 'Balık tutmak Focus yükseltir. Cal’ın yarışı 1. bölümde gelir. Dost hayvanlara L2 veya LT ile nişan al, öv, sonra Triangle veya Y ile sev. Mamalar markette kasadan alınır, bir seferde iki tane.',
      },
      {
        en: 'An impounded personal car comes back legally through Scooter Bros, or by breaking into the police impound. New cars cannot be kept in Chapter 1. Temporary unregistered storage starts in Chapter 2, and keeping stolen cars opens about halfway through that chapter.',
        tr: 'Çekilen kişisel araba Scooter Bros ile yasal olarak, ya da polis otoparkına girerek geri alınır. 1. bölümde yeni araba saklanamaz. Kayıtsız geçici park 2. bölümde başlar. Çalıntı arabayı tutmak o bölümün ortalarına doğru açılır.',
      },
      {
        en: 'Chapter 1 home repairs are optional relationship jobs: the steps, the railing, and the leaky roof. The Lab Fees code is inside the boutique after you call Brian. The Hauner Rhino is at Mile Zero Air Station, reached with a stunt jump, and it draws a six-star response.',
        tr: '1. bölümdeki ev tamirleri isteğe bağlı ilişki işleridir: merdiven, korkuluk ve akan çatı. Lab Fees kodu, Brian’ı aradıktan sonra butiğin içindedir. Hauner Rhino, Mile Zero Air Station’dadır. Bir stunt atlayışıyla girilir ve altı yıldız çeker.',
      },
      {
        en: 'White hit markers mean the target is still up. Yellow means they are down but alive. Red means they are dead. Non-lethal takedowns push a Criminal Profile toward Professional. You can loot bodies for ammo, cash, and consumables.',
        tr: 'Beyaz isabet, hedef hâlâ ayakta demektir. Sarı, yere indi ama yaşıyor demektir. Kırmızı, öldü demektir. Ölümcül olmayan etkisizleştirme suç profilini Professional’a iter. Cesetlerden mermi, nakit ve tüketilebilir çıkar.',
      },
      {
        en: 'Unowned guns work until you drop them, store them, or get busted. The trunk of a personal car can hold them. Owned guns come back free from an Ammu-Nation locker or that trunk. A yellow gun is a unique variant and stays unlocked. You cannot open a locker while carrying an unowned gun.',
        tr: 'Sahip olmadığın silah, bırakana, saklayana ya da yakalanana kadar çalışır. Kişisel arabanın bagajı onları tutar. Satın alınan silah, Ammu-Nation dolabından veya o bagajdan bedava geri gelir. Sarı silah eşsiz bir varyanttır ve açık kalır. Sahip olmadığın bir silah üstündeyken dolabı açamazsın.',
      },
      {
        en: 'Cars have a body meter and a fuel meter, both shown with D-pad down. Tolls are $5 unless the car is stolen. After Just a Scratch, Joey can bring your car to you. Jason’s safehouse starts with the Ganado, a Dinka ’72 Enduro under the house on the Ultimate Edition, and a Bombora S23 CCS at the dock. Getting busted or wasted drops the cash in your pockets. BuckMe money stays.',
        tr: 'Arabalarda gövde ve yakıt göstergesi vardır. İkisi de yön tuşunun aşağısıyla görünür. Geçiş ücreti 5 $’dır; araba çalıntıysa alınmaz. Just a Scratch’ten sonra Joey arabayı sana getirir. Jason’ın evi Ganado, Ultimate Edition’da evin altındaki Dinka ’72 Enduro ve iskeledeki Bombora S23 CCS ile başlar. Yakalanmak ya da ölmek ceplerdeki nakiti düşürür. BuckMe’deki para kalır.',
      },
      {
        en: 'Sprint is left-stick click. Jump is Cross or A. In Chapter 1, Brian’s lockup is at the southwest tip of Key Lento. The keypad code is 7700, and the stash sells at the yellow crate. After Coming Home, Donnie pays more. His trailer is mid-island, north of Nifty Threads, and the drop is a green crate. He pays by mail.',
        tr: 'Koşu, sol çubuğa basmaktır. Zıplama Cross veya A’dır. 1. bölümde Brian’ın kilidi Key Lento’nun güneybatı ucundadır. Tuş takımı kodu 7700’dür ve mal sarı kasadan satılır. Coming Home’dan sonra Donnie daha fazla öder. Karavanı adanın ortasında, Nifty Threads’in kuzeyindedir. Bırakma noktası yeşil bir kasadır. Ödeme postayla gelir.',
      },
      {
        en: 'Diving opens in Island Dreams. Kenton’s boat and Jason’s boat carry scuba gear. Equip the metal detector from the weapon wheel, aim with L2 or LT, and pick treasure up with Triangle or Y. Jason and Lucia cannot date or sleep with anyone else. Strip-club dances are as far as those clubs go, and Leonida has no solicited sex work.',
        tr: 'Dalış Island Dreams’te açılır. Kenton’ın teknesinde ve Jason’ın teknesinde dalış takımı vardır. Metal dedektörünü silah tekerleğinden kuşan, L2 veya LT ile nişan al, hazineyi Triangle veya Y ile al. Jason ve Lucia başkasıyla çıkamaz ya da yatamaz. Striptiz kulübündeki dans bunun sonudur ve Leonida’da parayla cinsel hizmet yoktur.',
      },
    ],
  },
]

export function briefBlocks(locale: 'en' | 'tr') {
  return GTA6_BRIEFING.map((block) => ({
    id: block.id,
    title: block.title[locale],
    body: block.body.map((line) => line[locale]),
  }))
}
