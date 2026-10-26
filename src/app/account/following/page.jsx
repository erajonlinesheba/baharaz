"use client";
import Link from "next/link";
import { useState } from "react";

const MOCK_FOLLOWING = [
  { id: 1, name: "Baharaz Official Store", image: "https://via.placeholder.com/80", followers: "12.5k", products: 342, rating: 4.9, verified: true, color: "#FF6B35" },
  { id: 2, name: "Fashion World BD", image: "https://via.placeholder.com/80", followers: "8.2k", products: 120, rating: 4.7, verified: true, color: "#8B5CF6" },
  { id: 3, name: "Gadget Pro", image: "https://via.placeholder.com/80", followers: "25k", products: 890, rating: 4.8, verified: true, color: "#06B6D4" },
  { id: 4, name: "Beauty & Care", image: "https://via.placeholder.com/80", followers: "3.1k", products: 56, rating: 4.6, verified: false, color: "#EC4899" },
];

export default function FollowingPage() {
  const [tab, setTab] = useState("stores");
  const [following, setFollowing] = useState(MOCK_FOLLOWING);
  const [search, setSearch] = useState("");

  const filtered = following.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const handleUnfollow = (id) => setFollowing((p) => p.filter((f) => f.id !== id));

  return (
    <div className="fPage">
      {/* Header Glass */}
      <div className="fHeader">
        <div className="fHeadLeft">
          <div className="fTitleIcon">⭐</div>
          <div>
            <h1>Following</h1>
            <p><span className="dot"></span>{following.length} stores you love</p>
          </div>
        </div>
        <div className="fHeadRight">
          <div className="fTabs">
            <button onClick={() => setTab("stores")} className={tab === "stores" ? "ftb on" : "ftb"}>🏪 Stores {following.length}</button>
            <button onClick={() => setTab("products")} className={tab === "products" ? "ftb on" : "ftb"}>❤️ Products 0</button>
          </div>
          <div className="fSearch">
            <span className="sIcon">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search following..." />
          </div>
        </div>
      </div>

      {tab === "stores" ? (
        filtered.length === 0 ? (
          <div className="fEmpty">
            <div className="emptyGlow"></div>
            <div className="emptyIcon">⭐</div>
            <h3>No following found</h3>
            <p>Discover amazing stores</p>
            <Link href="/" className="fExplore">✨ Explore Stores</Link>
          </div>
        ) : (
          <div className="fGrid">
            {filtered.map((s) => (
              <div key={s.id} className="fCard">
                <div className="cardGlow" style={{ background: s.color }}></div>
                <div className="fTop">
                  <div className="fAvatar" style={{ background: `linear-gradient(135deg, ${s.color}, #ffffff)` }}>
                    {s.name[0]}
                  </div>
                  <div className="fInfo">
                    <h3>{s.name} {s.verified && <span className="v">✔</span>}</h3>
                    <div className="fMeta">
                      <span className="rating">⭐ {s.rating}</span>
                      <span>•</span>
                      <span>{s.followers} followers</span>
                      <span>•</span>
                      <span className="prod">{s.products} products</span>
                    </div>
                  </div>
                </div>
                <div className="fActions">
                  <Link href={`/store/${s.id}`} className="visit">Visit Store →</Link>
                  <button onClick={() => handleUnfollow(s.id)} className="unfollow">Unfollow</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="fEmpty">
          <div className="emptyGlow"></div>
          <div className="emptyIcon">💖</div>
          <h3>No followed products</h3>
          <p>Your loved products will appear here</p>
          <Link href="/" className="fExplore">🛍️ Start Shopping</Link>
        </div>
      )}

      <style>{`
        .fPage{width:100%;min-height:100vh;box-sizing:border-box;padding:20px;background:linear-gradient(180deg, #FFF7ED 0%, #F8FAFC 40%, #EEF2FF 100%);overflow-x:hidden}
        
        /* Header - Mobile Glass */
        .fHeader{
          width:100%;box-sizing:border-box;
          background:rgba(255,255,255,0.8);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.6);
          border-radius:20px;
          padding:20px;
          display:flex;justify-content:space-between;align-items:center;gap:20px;
          box-shadow:0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          margin-bottom:20px;
        }
        .fHeadLeft{display:flex;gap:14px;align-items:center}
        .fTitleIcon{width:48px;height:48px;background:linear-gradient(135deg, #FF6B35, #F97316);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 8px 20px rgba(255,107,53,0.3);color:#fff}
        .fHeadLeft h1{margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#0F172A}
        .fHeadLeft p{margin:4px 0 0 0;font-size:13px;color:#64748B;display:flex;align-items:center;gap:6px;font-weight:500}
        .dot{width:8px;height:8px;background:#22C55E;border-radius:50%;box-shadow:0 0 0 4px rgba(34,197,94,0.15);display:inline-block}
        .fHeadRight{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
        .fTabs{display:flex;gap:8px;background:rgba(241,245,249,0.8);padding:5px;border-radius:100px;border:1px solid rgba(255,255,255,0.5)}
        .ftb{height:36px;padding:0 18px;border-radius:100px;border:0;background:transparent;font-size:13px;font-weight:700;cursor:pointer;color:#64748B;transition:.2s}
        .ftb.on{background:#0F172A;color:#fff;box-shadow:0 4px 12px rgba(15,23,42,0.2)}
        .fSearch{position:relative}
        .fSearch input{
          width:260px;height:42px;padding:0 16px 0 40px;border-radius:100px;
          border:1px solid rgba(226,232,240,0.8);background:rgba(255,255,255,0.9);
          backdrop-filter:blur(10px);font-size:13px;font-weight:500;outline:none;
          box-shadow:0 2px 10px rgba(0,0,0,0.04);transition:.2s
        }
        .fSearch input:focus{border-color:#FF6B35;box-shadow:0 0 0 4px rgba(255,107,53,0.12), 0 4px 16px rgba(0,0,0,0.06)}
        .sIcon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;opacity:0.6}

        /* Cards - Glass */
        .fGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .fCard{
          position:relative;overflow:hidden;
          background:rgba(255,255,255,0.75);
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.7);
          border-radius:20px;
          padding:18px;
          box-shadow:0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          transition:all .25s ease;
        }
        .fCard:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);border-color:rgba(255,255,255,0.9)}
        .cardGlow{position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;opacity:0.12;filter:blur(20px);pointer-events:none}
        .fTop{display:flex;gap:14px;align-items:flex-start;position:relative;z-index:1}
        .fAvatar{width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;flex-shrink:0;box-shadow:0 6px 16px rgba(0,0,0,0.12);border:2px solid rgba(255,255,255,0.8)}
        .fInfo{flex:1;min-width:0}
        .fInfo h3{margin:0 0 6px 0;font-size:15px;font-weight:800;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.2px}
        .v{background:linear-gradient(135deg, #3B82F6, #06B6D4);color:#fff;font-size:10px;padding:3px 6px;border-radius:20px;margin-left:6px}
        .fMeta{display:flex;gap:6px;flex-wrap:wrap;font-size:12px;color:#64748B;align-items:center;font-weight:500}
        .rating{background:rgba(255,251,235,0.8);color:#D97706;padding:2px 8px;border-radius:20px;font-weight:700;border:1px solid rgba(251,191,36,0.2)}
        .prod{color:#0F172A;font-weight:700}
        .fActions{display:flex;gap:10px;margin-top:4px;position:relative;z-index:1}
        .visit{
          flex:1;height:42px;display:flex;align-items:center;justify-content:center;
          background:linear-gradient(135deg, #FF6B35, #F97316);
          color:#fff;text-decoration:none;border-radius:12px;font-size:13px;font-weight:800;
          box-shadow:0 6px 16px rgba(255,107,53,0.3);transition:.2s
        }
        .visit:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(255,107,53,0.4)}
        .unfollow{flex:1;height:42px;border:1px solid rgba(226,232,240,0.8);background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;color:#475569;transition:.2s}
        .unfollow:hover{background:#fff;border-color:#CBD5E1}

        /* Empty */
        .fEmpty{position:relative;overflow:hidden;background:rgba(255,255,255,0.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.6);border-radius:24px;padding:70px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 12px 32px rgba(0,0,0,0.06)}
        .emptyGlow{position:absolute;width:300px;height:300px;background:radial-gradient(circle, rgba(255,107,53,0.15), transparent 70%);top:-80px;left:50%;transform:translateX(-50%);pointer-events:none}
        .emptyIcon{width:80px;height:80px;background:linear-gradient(135deg, #FFF7ED, #FFEDD5);border:1px solid rgba(255,107,53,0.15);border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 8px 24px rgba(255,107,53,0.15);position:relative}
        .fEmpty h3{font-size:18px;font-weight:900;margin:0;color:#0F172A}
        .fEmpty p{font-size:14px;color:#64748B;margin:0;font-weight:500}
        .fExplore{margin-top:8px;height:44px;padding:0 24px;background:#0F172A;color:#fff;text-decoration:none;border-radius:100px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;box-shadow:0 8px 20px rgba(15,23,42,0.2);transition:.2s}
        .fExplore:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(15,23,42,0.25)}

        @media(max-width:1100px){.fGrid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .fPage{padding:12px;background:linear-gradient(180deg, #FFF7ED 0%, #F8FAFC 100%)}
          .fHeader{flex-direction:column;align-items:flex-start;padding:16px;border-radius:18px}
          .fHeadRight{width:100%;flex-direction:column;align-items:stretch;gap:12px}
          .fTabs{width:100%;justify-content:space-between}
          .ftb{flex:1}
          .fSearch{width:100%}
          .fSearch input{width:100%}
          .fCard{border-radius:18px;padding:16px}
        }
      `}</style>
    </div>
  );
}