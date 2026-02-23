import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import "./Members.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

// ── 900 MALE members: English first name + local Kenyan male second name ──────
const maleFirst = [
  // Biblical / classic
  "David","Daniel","Samuel","Joseph","Michael","James","John","Peter","Paul","Mark",
  "Philip","Andrew","Simon","Stephen","Timothy","Thomas","Jonathan","Joshua","Nathan","Elijah",
  "Solomon","Samson","Moses","Aaron","Isaac","Jacob","Abraham","Ezekiel","Isaiah","Jeremiah",
  "Nehemiah","Obadiah","Matthias","Barnabas","Cornelius","Apollos","Silas","Titus","Lucius","Aquila",
  // Modern English popular in Kenya
  "Brian","Kevin","Victor","Dennis","Edwin","Collins","Duncan","Gilbert","Maxwell","Kelvin",
  "Patrick","Emmanuel","Geoffrey","Bernard","Lawrence","Leonard","Rodgers","Clinton","Clifford","Cornelius",
  "Allan","Albert","Alfred","Arnold","Arthur","Augustus","Benedict","Calvin","Cedric","Charles",
  "Christian","Christopher","Clarence","Clement","Conrad","Cyrus","Damian","Darius","Dexter","Dominic",
  "Douglas","Dwight","Edgar","Edmund","Edward","Elias","Elliott","Ernest","Eugene","Evan",
  "Felix","Ferdinand","Francis","Frank","Franklin","Frederick","George","Gerald","Gordon","Graham",
  "Gregory","Harold","Harrison","Harvey","Henry","Herbert","Herman","Howard","Humphrey","Ivan",
  "Jefferson","Jerome","Joel","Jordan","Julian","Julius","Kenneth","Laban","Levi","Lewis",
  "Lionel","Louis","Luther","Malcolm","Marcus","Martin","Maurice","Melvin","Milton","Morris",
  "Napoleon","Nelson","Nicholas","Norman","Oliver","Oscar","Owen","Percy","Preston","Raymond",
  "Reginald","Richard","Robert","Roland","Ronald","Roy","Rupert","Russell","Sebastian","Spencer",
  "Stanley","Sterling","Stewart","Sylvester","Theodore","Tobias","Trevor","Vincent","Walter","Warren",
  "Wesley","Wilfred","William","Willis","Wilson","Winston","Xavier","Adrian","Alvin","Andrew",
  "Anthony","Benjamin","Bradley","Brandon","Brendan","Brett","Byron","Cameron","Carter","Chad",
  "Clayton","Clive","Cody","Colin","Corey","Craig","Curtis","Cyril","Dale","Dalton",
  "Damien","Darren","Darryl","Dean","Derek","Desmond","Devon","Dixon","Donovan","Drew",
];

const maleLast = [
  // Kikuyu
  "Kamau","Mwangi","Njoroge","Kariuki","Karanja","Kimani","Githinji","Muriithi","Gacheru","Njogu",
  "Ngugi","Waithaka","Kuria","Macharia","Thuku","Kiarie","Waiganjo","Gatheru","Mugo","Ndegwa",
  "Waweru","Wainaina","Mbugua","Njau","Nderitu","Muthee","Gichuki","Maina","Njuki","Gicheru",
  "Kamande","Kinuthia","Gitau","Muchai","Njuguna","Kabiru","Gakuo","Ndungu","Gatimu","Mwathi",
  "Nganga","Gitonga","Kahiga","Kamande","Kamore","Kamura","Kanyi","Karimi","Karitu","Karuiki",
  // Luo
  "Otieno","Odhiambo","Ogola","Okello","Omondi","Owino","Onyango","Osoro","Okoth","Oduor",
  "Oluoch","Odero","Owuor","Ochola","Opondo","Okeyo","Omolo","Otiende","Ochieng","Odongo",
  "Owiti","Ogweno","Oloo","Ouma","Okwach","Okal","Opiyo","Okumu","Oduya","Owuonda",
  "Obiero","Obonyo","Obuya","Odhiambo","Ogada","Ogal","Ogamba","Ogaye","Ogindo","Ogola",
  // Kalenjin
  "Korir","Mutai","Bett","Rono","Sang","Yego","Keter","Rotich","Cheruiyot","Ngetich",
  "Kipchoge","Kiplagat","Kiplimo","Kipsang","Kibet","Kimeli","Tuwei","Maiyo","Tanui","Chesire",
  "Chepkwony","Koros","Lagat","Birgen","Limo","Sigei","Soi","Kimutai","Kirui","Kemboi",
  "Kiprotich","Serem","Kogo","Kibowen","Komen","Rutto","Ngeno","Letting","Kiprop","Bowen",
  "Chelimo","Chepyegon","Kalya","Kibor","Kibosek","Kimanzi","Kimeli","Kipkemboi","Kipketer","Kipkoech",
  // Luhya
  "Wafula","Barasa","Simiyu","Wekesa","Masinde","Shiundu","Wanyama","Khisa","Wangila","Wabwire",
  "Limunga","Makhanu","Makokha","Maloba","Luvisia","Wanaswa","Wafubwa","Wangwe","Wanjala","Wamukoya",
  "Murunga","Ingosi","Wasike","Wanyonyi","Wamalwa","Situma","Wafula","Wakhisi","Waliaula","Wamae",
  // Kamba
  "Mutua","Musyoka","Mutuku","Kimeu","Munyao","Kioko","Muli","Muema","Nzomo","Ndolo",
  "Nzuve","Nzioka","Mwangangi","Nthiwa","Nyamai","Ndunda","Mwanthi","Mutiso","Kivuva","Mwololo",
  "Mutunga","Kitavi","Kavoo","Munyoki","Nzau","Mulwa","Ndeti","Musau","Makau","Muthengi",
  // Meru / Embu
  "Mwenda","Njeru","Kirimi","Gitonga","Mbaabu","Muriuki","Mugambi","Rukenya","Ntiba","Kinyua",
  "Gichunge","Mwirigi","Kimathi","Bundi","Gikunda","Mburugu","Muriungi","Njagi","Kaburu","Nkurunu",
  "Muthamia","Mutwiri","Mwiti","Gitari","Munyi","Kirera","Murigi","Kathuri","Riungu","Gikundi",
  // Kisii / Gusii
  "Ongeri","Nyamweya","Omari","Ogari","Moturi","Nyakundi","Mose","Onkoba","Nyamao","Gesage",
  "Obara","Omare","Aroko","Maranga","Ondieki","Ombati","Bosire","Nyamota","Omurwa","Omogaka",
  // Coastal / Swahili
  "Rashid","Hamisi","Bakari","Charo","Kahindi","Kazungu","Juma","Salim","Ali","Hassan",
  "Omar","Abdalla","Mohamed","Hussein","Ngao","Masha","Baya","Katana","Ngala","Mwakio",
  // Mijikenda
  "Karisa","Kenga","Chai","Fondo","Randu","Tsofa","Tsuma","Mwangi","Mwavua","Mwadime",
  // Taita / Taveta
  "Mwangeka","Mghalu","Mlewa","Msagha","Mwakio","Mwakuwa","Mwambola","Mwamburi","Mwamzandi","Mwandoe",
];

// ── 100 FEMALE members: English first name + local Kenyan female second name ──
const femaleFirst = [
  "Grace","Faith","Mercy","Joy","Patience","Esther","Ruth","Sharon","Lydia","Beatrice",
  "Christine","Caroline","Vivian","Pauline","Millicent","Lilian","Josephine","Priscilla","Irene","Tabitha",
  "Sandra","Diana","Agnes","Alice","Rose","Margaret","Catherine","Elizabeth","Ann","Mary",
  "Gloria","Charity","Constance","Florence","Gladys","Harriet","Helena","Hilda","Ida","Jane",
  "Janet","Joan","Joyce","Judith","Julia","Karen","Laura","Leah","Linda","Lisa",
  "Lorna","Louise","Lucia","Lucy","Mabel","Martha","Miriam","Monica","Naomi","Nora",
  "Olive","Pamela","Phoebe","Phyllis","Rachel","Rebecca","Regina","Rhoda","Rita","Rosa",
  "Rosemary","Salome","Sarah","Selina","Sheila","Stella","Susan","Sylvia","Teresa","Tina",
  "Valerie","Veronica","Victoria","Viola","Virginia","Winnie","Yvonne","Zipporah","Abigail","Amelia",
  "Angela","Anita","Barbara","Bridget","Cecilia","Clara","Deborah","Dorothy","Edith","Eunice",
];

const femaleLast = [
  // Kikuyu female names
  "Wanjiku","Wanjiru","Wambui","Wangari","Nyambura","Wacera","Gathoni","Wangui","Njambi","Muthoni",
  "Nyokabi","Wairimu","Wahu","Njoki","Ngina","Nyawira","Wamuyu","Mumbi","Wanjera","Wangira",
  "Wanjeri","Nduta","Njeri","Wangare","Wacuka","Wangeci","Njenga","Wamuyu","Nyambura","Wangũi",
  // Luo female
  "Achieng","Adhiambo","Awino","Anyango","Atieno","Akoth","Apiyo","Awuor","Aloo","Adoyo",
  "Auma","Akello","Aoko","Akeyo","Achuol","Alego","Akech","Awuonda","Abiero","Akinyi",
  // Kalenjin female
  "Chebet","Chepkoech","Jepchirchir","Jepkosgei","Chepkemoi","Cheptoo","Jepkurui","Chepwogen","Jebichii","Chepkirui",
  "Chepngetich","Jeruto","Chemutai","Cherotich","Jemeli","Chepchoge","Chepng'eno","Jepleting","Chepkole","Jepkemboi",
  // Luhya female
  "Nafula","Nekesa","Nasimiyu","Nanjala","Naliaka","Nabwire","Namukhula","Nasambu","Nakhone","Nasike",
  "Namutebi","Nafuna","Nandwa","Nasirumbi","Namirembe","Nakhumicha","Nakhisa","Namayi","Nawire","Namukasa",
  // Kamba female
  "Ndinda","Mwikali","Nduku","Nzisa","Mwende","Wavinya","Wanza","Mumbua","Mutile","Nthoki",
  "Wayua","Wathoni","Kasyoka","Katunge","Munyiva","Mwongeli","Ndiliku","Nzilani","Syokau","Mueni",
  // Meru / Embu female
  "Karimi","Kagendo","Gatwiri","Ntinyari","Ciira","Kaendi","Nkatha","Gacimu","Kanana","Gakii",
  "Mugure","Kagure","Kaari","Kawira","Kananu","Mukiri","Nkirote","Kagwiria","Nchogu","Kaaria",
  // Kisii female
  "Nyaboke","Kemunto","Bosibori","Moraa","Gesare","Kwamboka","Nyakerario","Bochaberi","Bitutu","Kerubo",
  // Coastal female
  "Amina","Fatuma","Zuhura","Hadija","Mwanasha","Kadzo","Rehema","Zawadi","Imani","Neema",
];

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateMembers(count) {
  const members = [], usedNames = new Set();
  // First 900 male, last 100 female
  for (let i = 0; i < count; i++) {
    const isFemale = i >= 900;
    const firstPool = isFemale ? femaleFirst : maleFirst;
    const lastPool  = isFemale ? femaleLast  : maleLast;

    let firstName, lastName, fullName, attempts = 0;
    do {
      const r2 = seededRand(i * 6997 + 57331 + attempts * 1511 + attempts * attempts * 293);
      firstName = firstPool[Math.floor(r2() * firstPool.length)];
      lastName  = lastPool[Math.floor(r2() * lastPool.length)];
      fullName  = `${firstName} ${lastName}`;
      attempts++;
    } while (usedNames.has(fullName) && attempts < 100);
    if (usedNames.has(fullName)) fullName = `${fullName} ${String.fromCharCode(65 + (i % 26))}`;
    usedNames.add(fullName);

    const nameParts = fullName.split(" ");
    const initials  = `${nameParts[0][0]}${nameParts[1][0]}`;
    const r         = seededRand(i * 7919 + 31337);
    const roles     = ["VIP"];
    const locations = ["Nairobi, KE","Mombasa, KE","Kisumu, KE","Nakuru, KE","Eldoret, KE","Thika, KE","Nyeri, KE","Meru, KE","Malindi, KE","Garissa, KE","Kitale, KE","Kericho, KE","Embu, KE","Machakos, KE","Lamu, KE","Nanyuki, KE","Isiolo, KE","Homabay, KE","Migori, KE","Kakamega, KE","Naivasha, KE","Voi, KE","Wajir, KE","Marsabit, KE","Kilifi, KE"];
    const tiers     = ["Elite","Pro","Starter","Bronze"];
    const weights   = [0.05, 0.15, 0.35, 0.45];
    const statuses  = ["Online","Online","Online","Offline"];

    const role     = roles[Math.floor(r() * roles.length)];
    const location = locations[Math.floor(r() * locations.length)];
    const tierRoll = r();
    let tier = tiers[tiers.length - 1], cumulative = 0;
    for (let t = 0; t < tiers.length; t++) {
      cumulative += weights[t];
      if (tierRoll < cumulative) { tier = tiers[t]; break; }
    }
    const status   = statuses[Math.floor(r() * statuses.length)];
    const joined   = r() < 0.5 ? "2025" : "2026";
    const projects = Math.floor(r() * 24);
    const hue      = Math.floor(r() * 360);
    members.push({ id: i + 1, name: fullName, initials, role, location, tier, status, joined, projects, hue, gender: isFemale ? "F" : "M" });
  }
  return members;
}

function seededShuffle(arr) {
  const a = [...arr];
  let s = 987654321;
  const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


function memberID(id, hue) {
  const num = String(1000 + ((id * 7919 + hue * 31) % 9000)).padStart(4, '0');
  return `ID #MEGA${num}`;
}

const ALL_MEMBERS = seededShuffle(generateMembers(1000));

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const tiers = ["Elite","Pro","Starter","Bronze"];
const statusOptions = ["Online","Offline"];

function tierStyle(tier) {
  return {
    Elite:   { color: "#C8C8D8", borderColor: "rgba(200,200,216,0.3)", bg: "rgba(200,200,216,0.06)" },
    Pro:     { color: "#C9A96E", borderColor: "rgba(201,169,110,0.35)", bg: "rgba(201,169,110,0.08)" },
    Starter: { color: "#A0A0B0", borderColor: "rgba(160,160,176,0.3)",  bg: "rgba(160,160,176,0.06)" },
    Bronze:  { color: "#CD7F32", borderColor: "rgba(205,127,50,0.3)",   bg: "rgba(205,127,50,0.06)"  },
  }[tier] || {};
}

function statusColor(s) {
  return { Online: "#4CAF7D", Offline: "#E05252" }[s] || "#6A6A70";
}

function avatarBg(hue) {
  return `linear-gradient(135deg, hsla(${hue},25%,18%,1) 0%, hsla(${(hue+40)%360},20%,12%,1) 100%)`;
}

// ─── WINDOWED LIST ────────────────────────────────────────────────────────────
const GRID_CARD_H = 238;
const LIST_ROW_H  = 68;
const OVERSCAN    = 4;

function useWindowedItems(items, rowH) {
  const [range, setRange] = useState({ start: 0, end: 40 });
  const sentinelTop       = useRef(null);

  useEffect(() => {
    const update = () => {
      const vh       = window.innerHeight;
      const top      = sentinelTop.current?.getBoundingClientRect().top ?? 0;
      const startRow = Math.max(0, Math.floor(-top / rowH) - OVERSCAN);
      const visRows  = Math.ceil(vh / rowH) + OVERSCAN * 2;
      setRange({ start: startRow, end: Math.min(items.length, startRow + visRows) });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [items.length, rowH]);

  return { range, sentinelTop, totalH: items.length * rowH };
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Avatar({ initials, hue, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarBg(hue),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: size * 0.38, fontStyle: "italic",
      color: `hsla(${hue},50%,80%,0.9)`,
      border: `1px solid hsla(${hue},30%,35%,0.3)`,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

function TierBadge({ tier }) {
  const s = tierStyle(tier);
  return <span className="mem-tier-badge" style={{ color: s.color, borderColor: s.borderColor, background: s.bg }}>{tier}</span>;
}

// ─── GRID CARD ───────────────────────────────────────────────────────────────
function GridCard({ member: m }) {
  return (
    <div className="mem-card">
      <div className="mem-card-top">
        <Avatar initials={m.initials} hue={m.hue} size={48} />
        <TierBadge tier={m.tier} />
      </div>
      <div className="mem-card-name">{m.name}</div>
      <div className="mem-card-role">{m.role}</div>
      <div className="mem-card-meta">
        <div className="mem-meta-row">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {m.location}
        </div>
        <div className="mem-meta-row">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Since {m.joined}
        </div>
      </div>
      <div className="mem-card-footer">
        <div className="mem-card-id">{memberID(m.id, m.hue)}</div>
        <div className={`mem-card-status${m.status === "Online" ? " mem-status-online" : ""}`} style={{ color: statusColor(m.status) }}>{m.status}</div>
      </div>
    </div>
  );
}

// ─── LIST ROW ────────────────────────────────────────────────────────────────
function ListRow({ member: m }) {
  return (
    <div className="mem-row">
      <Avatar initials={m.initials} hue={m.hue} size={36} />
      <div>
        <div className="mem-row-name">{m.name}</div>
        <div className="mem-row-sub">{m.role}</div>
      </div>
      <div className="mem-row-location">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {m.location}
      </div>
      <TierBadge tier={m.tier} />
      <div className="mem-row-id">{memberID(m.id, m.hue)}</div>
      <div className={`mem-row-status${m.status === "Online" ? " mem-status-online" : ""}`} style={{ color: statusColor(m.status) }}>{m.status}</div>
      <div className="mem-row-year">{m.joined}</div>
    </div>
  );
}

// ─── WINDOWED GRID ───────────────────────────────────────────────────────────
function WindowedGrid({ items }) {
  const [cols, setCols] = useState(3);
  const wrapRef = useCallback((node) => {
    if (!node) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setCols(w >= 1100 ? 4 : w >= 780 ? 3 : w >= 500 ? 2 : 1);
    });
    ro.observe(node);
  }, []);

  const rows = useMemo(() => {
    const r = [];
    for (let i = 0; i < items.length; i += cols) r.push(items.slice(i, i + cols));
    return r;
  }, [items, cols]);

  const { range, sentinelTop, totalH } = useWindowedItems(rows, GRID_CARD_H + 2);

  return (
    <div ref={wrapRef}>
      <div ref={sentinelTop} />
      <div style={{ position: "relative", height: totalH }}>
        <div style={{ position: "absolute", top: range.start * (GRID_CARD_H + 2), left: 0, right: 0 }}>
          <div className="mem-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {rows.slice(range.start, range.end).map((row) =>
              row.map((m) => <GridCard key={m.id} member={m} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WINDOWED LIST ───────────────────────────────────────────────────────────
function WindowedList({ items }) {
  const { range, sentinelTop, totalH } = useWindowedItems(items, LIST_ROW_H + 2);

  return (
    <>
      <div className="mem-list-header">
        <span /><span>Member</span><span>Location</span>
        <span>Tier</span><span>ID</span>
        <span>Status</span><span>Since</span>
      </div>
      <div ref={sentinelTop} />
      <div style={{ position: "relative", height: totalH }}>
        <div style={{ position: "absolute", top: range.start * (LIST_ROW_H + 2), left: 0, right: 0 }}>
          <div className="mem-list">
            {items.slice(range.start, range.end).map((m) => <ListRow key={m.id} member={m} />)}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Members() {
  const [search,       setSearch]       = useState("");
  const [tierFilter,   setTierFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view,         setView]         = useState("grid");
  const [sort,         setSort]         = useState("joined");
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const filtered = useMemo(() => {
    let list = ALL_MEMBERS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q)
      );
    }
    if (tierFilter   !== "All") list = list.filter((m) => m.tier   === tierFilter);
    if (statusFilter !== "All") list = list.filter((m) => m.status === statusFilter);
    return [...list].sort((a, b) => {
      if (sort === "joined")   return Number(b.joined) - Number(a.joined);
      if (sort === "tier")     return tiers.indexOf(a.tier) - tiers.indexOf(b.tier);
      return 0;
    });
  }, [search, tierFilter, statusFilter, sort]);

  const tierCounts = useMemo(() =>
    Object.fromEntries(tiers.map((t) => [t, ALL_MEMBERS.filter((m) => m.tier === t).length])),
  []);

  const hasFilters       = tierFilter !== "All" || statusFilter !== "All" || !!search;
  const clearFilters     = () => { setSearch(""); setTierFilter("All"); setStatusFilter("All"); };
  const activeFilterCount = (tierFilter !== "All" ? 1 : 0) + (statusFilter !== "All" ? 1 : 0);

  return (
    <div className="mem-page">

      <div className="mem-title-bar">
        <div>
          <div className="mem-eyebrow"><span className="mem-eyebrow-line" />The Collective</div>
          <h1 className="mem-heading">Our <em>Members</em></h1>
        </div>
        <div className="mem-tier-counts">
          {tiers.map((t) => {
            const s = tierStyle(t);
            return (
              <div key={t} className="mem-tier-count">
                <div className="mem-tier-count-num" style={{ color: s.color }}>{tierCounts[t]}</div>
                <div className="mem-tier-count-label">{t}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mem-topbar">
        <div className="mem-search-wrap">
          <svg className="mem-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="mem-search"
            placeholder="Search name, role or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="mem-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <div className="mem-topbar-controls">
          <button
            className={`mem-filter-toggle${filtersOpen ? " open" : ""}${activeFilterCount > 0 ? " has-filters" : ""}`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
            {activeFilterCount > 0 && <span className="mem-filter-count">{activeFilterCount}</span>}
          </button>

          <select className="mem-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="joined">Newest</option>
            <option value="tier">Tier</option>
          </select>

          <div className="mem-view-toggle">
            <button className={`mem-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/>
                <rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button className={`mem-view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="List">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="1" width="16" height="2.5" rx="1"/>
                <rect x="0" y="6.5" width="16" height="2.5" rx="1"/>
                <rect x="0" y="12" width="16" height="2.5" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`mem-filter-panel${filtersOpen ? " open" : ""}`}>
        <div className="mem-filter-panel-inner">
          <div className="mem-filter-group">
            <span className="mem-filter-group-label">Tier</span>
            <div className="mem-filters">
              {["All", ...tiers].map((t) => (
                <button key={t} className={`mem-filter-btn${tierFilter === t ? " active" : ""}`} onClick={() => setTierFilter(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="mem-filter-group">
            <span className="mem-filter-group-label">Status</span>
            <div className="mem-filters">
              {["All", ...statusOptions].map((s) => (
                <button key={s} className={`mem-filter-btn${statusFilter === s ? " active" : ""}`} onClick={() => setStatusFilter(s)}>{s}</button>
              ))}
            </div>
          </div>
          {hasFilters && <button className="mem-clear-btn" onClick={clearFilters}>Clear all</button>}
        </div>
      </div>

      <div className="mem-results-bar">
        <span className="mem-results-text">
          {hasFilters ? (
            <><strong>{filtered.length.toLocaleString()}</strong> results<span className="mem-clear-inline" onClick={clearFilters}> — clear</span></>
          ) : (
            <><strong>10,000+</strong> members</>
          )}
        </span>
        <div className="mem-legend">
          {[["Elite","#C8C8D8"],["Pro","#C9A96E"],["Starter","#A0A0B0"],["Bronze","#CD7F32"]].map(([label, color]) => (
            <div key={label} className="mem-legend-dot" style={{ "--dot-color": color }}>{label}</div>
          ))}
        </div>
      </div>

      <div className="mem-content">
        {filtered.length === 0 ? (
          <div className="mem-empty">
            <div className="mem-empty-icon">◇</div>
            <h3>No members found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : view === "grid" ? (
          <WindowedGrid items={filtered} />
        ) : (
          <WindowedList items={filtered} />
        )}
      </div>

    </div>
  );
}
