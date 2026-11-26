export type TipGroup = 'start' | 'money' | 'driving' | 'wanted' | 'combat' | 'explore'

export type Tip = {
  id: string
  group: TipGroup
  title: { en: string; tr: string }
  body: { en: string; tr: string }
  /** Published map marker ids (tips/story help or MapGenie). */
  mapPins?: string[]
}

/** Actionable tips confirmed across IGN, GTABase, GamesRadar, and related public guides. */
export const GTA6_TIP_GROUPS: { id: TipGroup; title: { en: string; tr: string } }[] = [
  { id: 'start', title: { en: 'First hour', tr: 'İlk saat' } },
  { id: 'money', title: { en: 'Cash & bank', tr: 'Nakit ve banka' } },
  { id: 'driving', title: { en: 'Driving tricks', tr: 'Sürüş hileleri' } },
  { id: 'wanted', title: { en: 'Cops & heat', tr: 'Polis ve heat' } },
  { id: 'combat', title: { en: 'Fight & stealth', tr: 'Çatışma ve gizlilik' } },
  { id: 'explore', title: { en: 'Explore & habits', tr: 'Keşif ve alışkanlık' } },
]

export const GTA6_TIPS: Tip[] = [
  {
    id: 'classic-controls',
    group: 'start',
    title: { en: 'Switch to Classic controls', tr: 'Classic kontrollere geç' },
    body: {
      en: 'Default puts sprint on left-stick click and jump on Cross/A. Settings → Classic puts run back on Cross/A and jump on Square/X, closer to GTA V.',
      tr: 'Varsayılan düzende koşu sol çubuğa basmak, zıplama Cross/A. Ayarlar → Classic, koşuyu Cross/A’ya, zıplamayı Square/X’e alır; GTA V’e daha yakındır.',
    },
  },
  {
    id: 'save-slots',
    group: 'start',
    title: { en: 'Use your 15 save slots', tr: '15 kayıt yuvasını kullan' },
    body: {
      en: 'There are 15 manual slots plus one autosave. Missions cannot be replayed. Keep a save at the start of each chapter, and save before you quit from the console home screen.',
      tr: '15 manuel yuva ve bir otomatik kayıt vardır. Görevler yeniden oynatılamaz. Her bölüm başında bir kayıt tut; konsol ana ekranından çıkmadan önce kaydet.',
    },
  },
  {
    id: 'hud-nav',
    group: 'start',
    title: { en: 'Learn the dynamic HUD', tr: 'Dinamik HUD’u öğren' },
    body: {
      en: 'Minimap, cash and bars stay hidden until you tap D-pad Down. Hold Down for Quick Navigation: nearby stops and activities, then set a waypoint with the right stick without opening the map.',
      tr: 'Minimap, nakit ve çubuklar D-pad Aşağı’ya basana kadar gizli kalır. Aşağıyı basılı tutunca Quick Navigation açılır: yakındaki duraklar ve aktiviteler; haritayı açmadan sağ çubukla işaret koyarsın.',
    },
  },
  {
    id: 'easy-toggles',
    group: 'start',
    title: { en: 'Stuck? Try accessibility toggles', tr: 'Takıldın mı? Erişilebilirlik seçenekleri' },
    body: {
      en: 'There is no difficulty slider. Settings → Gameplay has Accessible Combat and Reduced Vehicle Damage. They change the balance; use them for missions you cannot clear.',
      tr: 'Zorluk kaydırıcısı yok. Ayarlar → Gameplay altında Accessible Combat ve Reduced Vehicle Damage vardır. Dengeleri değiştirir; geçemediğin görevlerde kullan.',
    },
  },
  {
    id: 'story-first',
    group: 'start',
    title: { en: 'Follow the story in hour one', tr: 'İlk saatte hikayeyi takip et' },
    body: {
      en: 'Early missions unlock the phone tools, buyers, and people you need. Wandering Leonida without them usually means a wanted level and empty pockets.',
      tr: 'Erken görevler telefon araçlarını, alıcıları ve ihtiyaç duyacağın kişileri açar. Bunlar olmadan Leonida’da dolaşmak genelde aranma ve boş cep demektir.',
    },
    mapPins: ['gta6-tip-gear-up-ammu', 'gta6-tip-brian-lockup', 'gta6-tip-just-a-scratch'],
  },
  {
    id: 'floorboards',
    group: 'money',
    title: { en: 'Stash cash before Buck Me', tr: 'Buck Me’den önce nakiti sakla' },
    body: {
      en: 'Pocket cash is lost when you are wasted or busted. Until Buck Me opens the bank, use the loose floorboards in Jason’s bedroom in Key Lento. After that, deposit at an ATM into BuckMe.',
      tr: 'Cepteki nakit ölünce veya yakalanınca gider. Buck Me bankayı açana kadar Key Lento’daki Jason’ın yatak odasındaki gevşek döşemeleri kullan. Sonra ATM’den BuckMe’ye yatır.',
    },
    mapPins: ['gta6-tip-jason-house-stash', 'gta6-tip-buckme-fleeca'],
  },
  {
    id: 'cash-cap',
    group: 'money',
    title: { en: 'Watch the $20,000 carry cap', tr: '$20.000 taşıma sınırına dikkat' },
    body: {
      en: 'You can carry up to $20,000 as pocket cash. Bank the rest. Many purchases can pull from BuckMe even when your pockets are light.',
      tr: 'Cepte en fazla 20.000 $ taşınır. Fazlasını bankaya koy. Birçok harcama, cebin boşken bile BuckMe’den çekilebilir.',
    },
  },
  {
    id: 'scan-before-steal',
    group: 'money',
    title: { en: 'Scan cars before you steal', tr: 'Çalmadan önce arabayı tara' },
    body: {
      en: 'Open WAiNK and scan parked cars. It shows security level, tracker, fence value, and register cost. A cheap car with no tracker is a safer early sale than a tracked luxury ride.',
      tr: 'WAiNK’i açıp park halindeki arabaları tara. Güvenlik, tracker, alıcı değeri ve kayıt ücretini gösterir. Trackersiz ucuz araba, izlenen lüks arabaya göre daha güvenli erken satıştır.',
    },
  },
  {
    id: 'no-keep-ch1',
    group: 'money',
    title: { en: 'Chapter 1 cars are temporary', tr: '1. bölüm arabaları geçici' },
    body: {
      en: 'You cannot register and keep stolen cars in Chapter 1. Sell easy cars when a fence opens later, and keep one throwaway ride for messy jobs once registration starts in Chapter 2.',
      tr: '1. bölümde çalıntı arabayı kaydedip tutamazsın. Alıcılar sonra açılınca kolay arabaları sat; kayıt 2. bölümde başlayınca kirli işler için bir feda arabası tut.',
    },
    mapPins: ['gta6-tip-moses-register', 'gta6-tip-brian-lockup', 'gta6-tip-donnie-trailer'],
  },
  {
    id: 'free-sm69',
    group: 'explore',
    title: { en: 'Free SM-69 on Badger tower', tr: 'Badger kulesinde bedava SM-69' },
    body: {
      en: 'Climb Badger R&D Tower next to Nifty Threads in Key Lento. Grey electrical door, then stairs and ladders to the balcony rifle. Grab Thelma’s card and the roof parachute while you are up there.',
      tr: 'Key Lento’da Nifty Threads yanındaki Badger R&D Kulesi’ne çık. Gri elektrik kapısı, merdiven ve merdivenlerle balkondaki tüfeğe. Oradayken Thelma kartını ve çatı paraşütünü de al.',
    },
    mapPins: ['gta6-tip-sm69-tower', 'gta6-tip-nifty-threads'],
  },
  {
    id: 'brian-7700',
    group: 'explore',
    title: { en: "Brian's Lockup code 7700", tr: 'Brian kilidi kodu 7700' },
    body: {
      en: 'Lab Fees sends you to Brian’s Lockup by Isla Tropical. Keypad 7700. Moonstone Boutique’s lab door is reported as 0420 before that drop.',
      tr: 'Lab Fees seni Isla Tropical yanındaki Brian kilidine yollar. Tuş takımı 7700. Ondan önce Moonstone Boutique laboratuvar kapısı 0420 olarak geçiyor.',
    },
    mapPins: ['gta6-tip-brian-lockup'],
  },
  {
    id: 'gas-repair',
    group: 'money',
    title: { en: 'Gas stations also repair', tr: 'Benzinlikler de tamir eder' },
    body: {
      en: 'Fill up before long drives; stolen cars often arrive low on fuel. Pumps also do minor repairs, usually cheaper than calling recovery when cash is tight.',
      tr: 'Uzun yoldan önce doldur; çalıntı arabalar çoğu zaman az yakıtla gelir. Pompa küçük tamir de yapar; nakit daralınca kurtarma çağırmaktan genelde ucuzdur.',
    },
  },
  {
    id: 'duck-hide',
    group: 'driving',
    title: { en: 'Duck in a parked car', tr: 'Park halindeki arabada eğil' },
    body: {
      en: 'Hold Circle/B in a stationary vehicle to duck and hide. It also works if you jump into a parked car on foot while the cops are looking.',
      tr: 'Duran araçta Circle/B basılı tutarak eğilip saklan. Polis ararken yaya olarak park halindeki arabaya atlayınca da işe yarar.',
    },
  },
  {
    id: 'engine-running',
    group: 'driving',
    title: { en: 'Leave the engine running', tr: 'Motoru çalışır bırak' },
    body: {
      en: 'Double-tap Triangle/Y to bail out with the engine on. At speed the car keeps going. On a boat, the same double-tap lets you walk the deck while it holds course.',
      tr: 'Triangle/Y’ye çift basınca motor açık kalır. Hızdayken araba yoluna devam eder. Teknede aynı çift basış, tekne rotadayken güvertede dolaşmanı sağlar.',
    },
  },
  {
    id: 'flip-car',
    group: 'driving',
    title: { en: 'Flip an overturned car', tr: 'Devrilen arabayı düzelt' },
    body: {
      en: 'Walk up to a car on its side or roof, press L3/LS, then hold Square/X to shove it back onto its wheels. From the front or rear you can also push with the left stick and hold Square/X for a harder shove.',
      tr: 'Yan yatırılmış veya ters dönmüş arabaya yaklaş, L3/LS’ye bas, sonra Square/X’i basılı tutup tekerleklerine oturt. Önden veya arkadan sol çubukla itebilir, daha sert itmek için Square/X’i basılı tutabilirsin.',
    },
  },
  {
    id: 'handbrake-drift',
    group: 'driving',
    title: { en: 'Handbrake drift', tr: 'El freniyle drift' },
    body: {
      en: 'Hold X/A while turning at speed for a handbrake turn. It also works on boats when you need a tight swing.',
      tr: 'Hızdayken dönerken X/A’yı basılı tut: el freni dönüşü. Tekelerde de dar dönüş için işe yarar.',
    },
  },
  {
    id: 'drive-by',
    group: 'driving',
    title: { en: 'Drive-by and tire shots', tr: 'Araçtan ateş ve lastik' },
    body: {
      en: 'Press L1/LB for your sidearm, then R1/RB to fire while driving. Shoot cop-car tires to slow a chase; helicopters may peel off if shot at.',
      tr: 'Sürerken L1/LB ile tabancayı çıkar, R1/RB ile ateş et. Polis arabasının lastiklerini vurarak kovalamayı yavaşlat; helikopterlere ateş edince uzaklaşabilirler.',
    },
  },
  {
    id: 'auto-drive',
    group: 'driving',
    title: { en: 'Auto-drive / cinematic', tr: 'Otomatik sürüş / sinematik' },
    body: {
      en: 'Set a waypoint, hold D-pad Down, open the Options/Menu cinematic view, then hold Circle/B so the character drives for you.',
      tr: 'İşaret koy, D-pad Aşağı’yı basılı tut, Options/Menu ile sinematik görünüme geç, sonra Circle/B basılı tut; karakter senin için sürer.',
    },
  },
  {
    id: 'rydeme',
    group: 'driving',
    title: { en: 'Fast travel costs $100 to skip', tr: 'Hızlı seyahatte atlama 100 $' },
    body: {
      en: 'Paradise Taxi unlocks in Chapter 1; RydeMe arrives in Chapter 2 and pulls from BuckMe. In the cab, focus the driver with L2/LT and hold Triangle/Y to skip for an extra $100. Buses and trains skip to a stop on their line after you board.',
      tr: 'Paradise Taxi 1. bölümde açılır; RydeMe 2. bölümde gelir ve BuckMe’den çeker. Taksiye binince L2/LT ile sürücüye odaklan, Triangle/Y basılı tutarak ekstra 100 $ ile atla. Otobüs ve tren, bindikten sonra kendi hattındaki durağa atlar.',
    },
  },
  {
    id: 'flee-early',
    group: 'wanted',
    title: { en: 'Flee while cops are only responding', tr: 'Polis henüz yoldayken kaç' },
    body: {
      en: 'Gray “responding” stars are your best window. Leave the scene before they see you and you may never enter a pursuit. Cops no longer sit on the minimap; use Focus to track them.',
      tr: 'Gri “yolda” yıldızlar en iyi pencerendir. Seni görmeden sahneden çıkarsan kovalamaya hiç girmeyebilirsin. Polisler artık minimap’te görünmez; Focus ile takip et.',
    },
  },
  {
    id: 'clear-heat',
    group: 'wanted',
    title: { en: 'Clear heat icons, then leave', tr: 'Heat simgelerini temizle, sonra çık' },
    body: {
      en: 'Icons under the stars show what still IDs you: face, outfit, vehicle, visible longarm, partner, CCTV. Change accessories or clothes, respray or swap cars, holster or stash longarms, split Jason and Lucia, destroy on-site CCTV when you can. Cloud CCTV cannot be wiped.',
      tr: 'Yıldızların altındaki simgeler seni hâlâ neyin teşhis ettiğini gösterir: yüz, kıyafet, araç, görünür uzun silah, partner, CCTV. Aksesuar veya kıyafet değiştir, boya veya araba değiştir, uzun silahı kınına koy veya bagaja at, Jason ile Lucia’yı ayır, yerinde CCTV’yi yok et. Bulut CCTV silinemez.',
    },
  },
  {
    id: 'spare-outfit',
    group: 'wanted',
    title: { en: 'Keep a spare outfit in the trunk', tr: 'Bagajda yedek kıyafet tut' },
    body: {
      en: 'Save an outfit to your personal car. Change from the trunk or weapon wheel when police know your look. A mask before a crime, then remove it once you are clear, also helps appearance heat.',
      tr: 'Kişisel arabana bir kıyafet kaydet. Polis görünüşünü biliyorsa bagajdan veya silah tekerleğinden değiştir. Suçtan önce maske takıp temizlenince çıkarmak da görünüş heat’ine yardım eder.',
    },
  },
  {
    id: 'k9',
    group: 'wanted',
    title: { en: 'Keep moving if K9 is out', tr: 'K9 çıktıysa hareket et' },
    body: {
      en: 'K9 units track you hard. Ducking in place is not enough once dogs are called; break line of sight and leave the search radius.',
      tr: 'K9 birimleri seni sıkı takip eder. Köpekler çağrıldıktan sonra yerinde eğilmek yetmez; görüşü kes ve arama yarıçapından çık.',
    },
  },
  {
    id: 'yellow-hits',
    group: 'combat',
    title: { en: 'Yellow hits keep people alive', tr: 'Sarı isabet yaşatır' },
    body: {
      en: 'White hit markers mean the target is still up. Yellow means down but alive. Red means dead. Non-lethal shots and takedowns push Criminal Profile toward Professional and can add Focus.',
      tr: 'Beyaz isabet hedef hâlâ ayakta demektir. Sarı yere indi ama yaşıyor demektir. Kırmızı öldü demektir. Ölümcül olmayan atış ve etkisizleştirme suç profilini Professional’a iter ve Focus ekleyebilir.',
    },
  },
  {
    id: 'holster-trunk',
    group: 'combat',
    title: { en: 'Holster and trunk your guns', tr: 'Silahı kınına koy, bagaja at' },
    body: {
      en: 'Holster with L1/LB. Unowned guns vanish if you drop them, quit, or get busted unless they sit in your personal trunk. Owned Ammu-Nation guns return from lockers or that trunk.',
      tr: 'L1/LB ile kınına koy. Sahip olmadığın silahlar, kişisel bagajda değillerse bırakınca, çıkınca veya yakalanınca gider. Ammu-Nation’dan alınanlar dolaptan veya o bagajdan geri gelir.',
    },
  },
  {
    id: 'stealth-tools',
    group: 'combat',
    title: { en: 'Whistle, throw, then takedown', tr: 'Islık, fırlat, etkisizleştir' },
    body: {
      en: 'Crouch with Circle/B. Hold L2/LT while looking at an enemy to whistle them over. Throw bottles to pull guards. From behind, hold R2/RT then mash Square/X for a stealth takedown.',
      tr: 'Circle/B ile çömel. Düşmana bakarken L2/LT basılı tutarak ıslık çal. Şişe fırlatarak gardiyanları çek. Arkadan R2/RT basılı tut, Square/X’e basarak gizlilik etkisizleştirmesi yap.',
    },
  },
  {
    id: 'focus-scan',
    group: 'explore',
    title: { en: 'Focus when you hear trouble', tr: 'Gürültü duyunca Focus aç' },
    body: {
      en: 'Click both sticks. White marks doors and consumables, red marks enemies and alarms, purple marks fenceable drugs, green marks cash. Use it when you hear screams or sirens to find random events.',
      tr: 'İki çubuğa birden bas. Beyaz kapı ve tüketilebilirleri, kırmızı düşman ve alarmları, mor satılabilir uyuşturucuyu, yeşil nakiti işaretler. Çığlık veya siren duyunca rastgele olayları bulmak için kullan.',
    },
  },
  {
    id: 'eat-on-move',
    group: 'explore',
    title: { en: 'Eat and drink on the move', tr: 'Hareket halinde ye iç' },
    body: {
      en: 'Food and drink buff Health, Stamina and Focus without stopping the action. You can consume while walking, driving, or shooting. Home fridge, water and an apple are an easy early buff.',
      tr: 'Yiyecek ve içecek Sağlık, Dayanıklılık ve Focus’u aksiyonu durdurmadan yükseltir. Yürürken, sürerken veya ateş ederken tüketebilirsin. Evdeki buzdolabı, su ve elma kolay erken buff’tır.',
    },
  },
  {
    id: 'enterable',
    group: 'explore',
    title: { en: 'Read the map colors', tr: 'Harita renklerini oku' },
    body: {
      en: 'Darker blue buildings on the map have interiors; lighter ones do not. On the minimap, usable doors show as white lines, and back rooms appear as you get close.',
      tr: 'Haritada daha koyu mavi binaların içi vardır; açık olanların yoktur. Minimap’te kullanılabilir kapılar beyaz çizgiyle görünür; arka odalar yaklaşınca çıkar.',
    },
  },
  {
    id: 'pet-animals',
    group: 'explore',
    title: { en: 'Pet dogs and cats', tr: 'Köpek ve kedileri sev' },
    body: {
      en: 'Aim with L2/LT, praise, then pet with Triangle/Y. It boosts Focus and feeds a cleaner profile. Treats buy two at a time from a grocery register.',
      tr: 'L2/LT ile nişan al, öv, Triangle/Y ile sev. Focus yükseltir ve daha temiz profile katkı verir. Mamalar market kasasından bir seferde iki alınır.',
    },
  },
  {
    id: 'binoculars',
    group: 'explore',
    title: { en: 'Mark threats with binoculars', tr: 'Dürbünle tehdit işaretle' },
    body: {
      en: 'Before a guarded area, use binoculars to mark enemies from range. The same tool studies animals for the fauna log without hunting them.',
      tr: 'Korumalı bir alana girmeden dürbünle uzaktan düşman işaretle. Aynı araç, avlamadan fauna kaydı için hayvanları inceler.',
    },
  },
]

export function tipBlocks(locale: 'en' | 'tr') {
  return GTA6_TIP_GROUPS.map((group) => ({
    id: group.id,
    title: group.title[locale],
    tips: GTA6_TIPS.filter((tip) => tip.group === group.id).map((tip) => ({
      id: tip.id,
      title: tip.title[locale],
      body: tip.body[locale],
      mapPins: tip.mapPins ?? [],
    })),
  })).filter((group) => group.tips.length > 0)
}
