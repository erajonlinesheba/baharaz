"use client";
import { useState } from "react";

export default function PaymentPage() {
  const [cards, setCards] = useState([
    { id: 1, type: "VISA", number: "4242", name: "BILAL RAJ", expiry: "12/28", default: true, grad: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)" },
    { id: 2, type: "MASTERCARD", number: "8888", name: "BILAL RAJ", expiry: "09/27", default: false, grad: "linear-gradient(135deg,#FF6B35 0%,#FB923C 100%)" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const addCard = () => {
    if (!newCard.number || !newCard.name) return alert("Card info required!");
    setCards([...cards, { id: Date.now(), type: "VISA", number: newCard.number.slice(-4), name: newCard.name.toUpperCase(), expiry: newCard.expiry || "12/30", default: false, grad: "linear-gradient(135deg,#8B5CF6 0%,#6366F1 100%)" }]);
    setNewCard({ number: "", name: "", expiry: "", cvv: "" });
    setShowAdd(false);
  };

  return (
    <div className="mainWrap">
      {/* DESKTOP - Standard Light Background, No Extra Scroll */}
      <div className="dWrap">
        <div className="dHeader">
          <div className="dHLeft">
            <div className="dIcon">💳</div>
            <div><h1>Payment Wallet</h1><p>✨ {cards.length} cards • Secure</p></div>
          </div>
          <button className="dAdd" onClick={() => setShowAdd(true)}>+ Add Card</button>
        </div>

        <div className="balanceCard">
          <div className="balLeft"><span>Total Balance</span><b>৳ 24,500</b><p>🔒 Encrypted • 2 cards</p></div>
          <div className="balBlur"></div>
        </div>

        <div className="secTitle"><b>Saved Cards</b><span>{cards.length}</span></div>
        <div className="cardList">
          {cards.map((c) => (
            <div key={c.id} className="dCard" style={{ background: c.grad }}>
              <div className="glow"></div>
              <div className="cTop"><div className="chip"></div><span>{c.type}</span>{c.default && <span className="def">Default ✨</span>}</div>
              <div className="cNum">•••• •••• •••• {c.number}</div>
              <div className="cBot"><div><label>HOLDER</label><b>{c.name}</b></div><div><label>EXPIRES</label><b>{c.expiry}</b></div></div>
              <div className="cAct"><button onClick={() => setCards(cards.map(x => ({ ...x, default: x.id === c.id })))} className={c.default ? "ca on" : "ca"}>{c.default ? "✓ Default" : "Set Default"}</button><button onClick={() => setCards(cards.filter(x => x.id !== c.id))} className="ca del">Remove</button></div>
            </div>
          ))}
        </div>

        <div className="secTitle mt"><b>Other Methods</b><span>4</span></div>
        <div className="methods">
          <div className="mItem"><div className="mIcon bk">৳</div><div className="mText"><b>bKash</b><span>Connected</span></div><span className="ok">✓ Active</span></div>
          <div className="mItem"><div className="mIcon ng">N</div><div className="mText"><b>Nagad</b><span>Tap to link</span></div><button className="mBtn">Link</button></div>
          <div className="mItem"><div className="mIcon rk">R</div><div className="mText"><b>Rocket</b><span>Connected</span></div><span className="ok">✓ Active</span></div>
          <div className="mItem"><div className="mIcon cd">COD</div><div className="mText"><b>Cash on Delivery</b><span>Enabled</span></div><span className="ok">✓</span></div>
        </div>

        <div className="payBox">
          <div className="row"><span>Subtotal</span><b>৳12,450</b></div>
          <div className="row"><span>Shipping</span><b>৳60</b></div>
          <div className="row"><span>Fee</span><b className="green">Free</b></div>
          <div className="line"></div>
          <div className="row total"><span>Total</span><b>৳12,010</b></div>
          <button className="payBtn" onClick={()=>alert("Paid ৳12,010 ✓")}>Pay Now ৳12,010 →</button>
          <p className="safe">🔒 256-bit SSL • Secure Payment</p>
        </div>
      </div>

      {/* PHONE - Light Background, Perfect Size */}
      <div className="pWrap">
        <div className="iphone">
          <div className="notch"></div>
          <div className="screen">
            <div className="pHead"><div><h1>Payment</h1><p>Manage your cards</p></div><button className="pAdd" onClick={() => setShowAdd(true)}>+</button></div>
            <div className="pBal"><span>TOTAL BALANCE</span><b>৳ 24,500</b><div className="pBlur"></div></div>
            <div className="pSec"><div className="pTitle"><b>Saved Cards</b><span>{cards.length}</span></div>
              <div className="pScroll">
                {cards.map((c) => (
                  <div key={c.id} className="pCard" style={{ background: c.grad }}>
                    <div className="pTop"><div className="chip"></div><span>{c.type}</span></div>
                    <div className="pNum">•••• •••• •••• {c.number}</div>
                    <div className="pBot"><div><label>HOLDER</label><b>{c.name}</b></div><div><label>EXPIRY</label><b>{c.expiry}</b></div>{c.default && <div className="pDef">Default</div>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pList">
              {cards.map((c) => (
                <div key={c.id} className="pRow"><div className="pIcon" style={{ background: c.default ? "#0F172A" : "#F1F5F9", color: c.default ? "#fff" : "#64748B" }}>{c.type[0]}</div><div className="pInfo"><b>{c.type} •• {c.number}</b><span>{c.expiry}</span></div><button onClick={() => setCards(cards.map(x => ({ ...x, default: x.id === c.id })))} className={c.default ? "pb on" : "pb"}>{c.default ? "✓" : "Set"}</button><button onClick={() => setCards(cards.filter(x => x.id !== c.id))} className="pb del">✕</button></div>
              ))}
            </div>
            <div className="pMethods"><div className="mItem"><div className="mIcon bk">৳</div><div className="mText"><b>bKash</b><span>Connected</span></div><span className="ok">✓</span></div><div className="mItem"><div className="mIcon ng">N</div><div className="mText"><b>Nagad</b><span>Tap</span></div><button className="mBtn">Link</button></div><div className="mItem"><div className="mIcon rk">R</div><div className="mText"><b>Rocket</b><span>Connected</span></div><span className="ok">✓</span></div></div>
            <div className="pPay"><button className="pPayBtn">Pay Now ৳12,010 →</button><p>🔒 Secure</p></div>
          </div>
          <div className="homeBar"></div>
        </div>
      </div>

      {showAdd && (
        <div className="modalBg" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="mHead"><h3>Add Card</h3><button onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="form">
              <label>CARD NUMBER</label><input value={newCard.number} onChange={e => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} placeholder="4242 4242 4242 4242" />
              <label>HOLDER NAME</label><input value={newCard.name} onChange={e => setNewCard({ ...newCard, name: e.target.value })} placeholder="BILAL RAJ" />
              <div className="two"><div><label>EXPIRY</label><input value={newCard.expiry} onChange={e => setNewCard({ ...newCard, expiry: e.target.value })} placeholder="MM/YY" /></div><div><label>CVV</label><input value={newCard.cvv} onChange={e => setNewCard({ ...newCard, cvv: e.target.value })} placeholder="123" /></div></div>
              <button className="save" onClick={addCard}>✨ Save Card</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mainWrap{width:100%;min-height:auto;background:#F8FAFC;display:block;box-sizing:border-box;overflow:visible}
        /* DESKTOP - No Extra Scroll */
        .dWrap{display:block;width:100%;max-width:520px;margin:0 auto;padding:16px 16px 24px 16px;box-sizing:border-box;overflow:visible;background:#F8FAFC;border-radius:0}
        .pWrap{display:none}
        .dHeader{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:16px;padding:14px 16px;margin-bottom:12px;box-shadow:0 2px 12px rgba(0,0,0,0.04)}
        .dHLeft{display:flex;gap:12px;align-items:center}
        .dIcon{width:42px;height:42px;background:linear-gradient(135deg,#FF6B35,#F97316);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .dHeader h1{margin:0;font-size:16px;font-weight:900;color:#0F172A}.dHeader p{margin:2px 0 0 0;font-size:11px;color:#64748B;font-weight:600}
        .dAdd{height:34px;padding:0 14px;background:#0F172A;color:#fff;border:0;border-radius:100px;font-weight:800;font-size:11px;cursor:pointer;white-space:nowrap}
        .balanceCard{width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:16px;padding:14px 16px;color:#fff;position:relative;overflow:hidden;margin-bottom:14px;box-sizing:border-box}
        .balanceCard span{font-size:9px;opacity:0.6;font-weight:700;letter-spacing:0.5px}.balanceCard b{font-size:22px;font-weight:900;display:block;margin-top:2px}.balanceCard p{font-size:10px;opacity:0.6;margin:4px 0 0 0}.balBlur{position:absolute;right:-20px;top:-20px;width:90px;height:90px;background:radial-gradient(circle,rgba(255,107,53,0.35),transparent 70%)}
        .secTitle{display:flex;align-items:center;gap:8px;margin:14px 0 10px 0}.secTitle b{font-size:13px;font-weight:900;color:#0F172A}.secTitle span{background:#0F172A;color:#fff;font-size:10px;padding:2px 7px;border-radius:20px;font-weight:800}.secTitle.mt{margin-top:18px}
        .cardList{display:flex;flex-direction:column;gap:10px;overflow:visible}
        .dCard{width:100%;max-width:360px;border-radius:16px;padding:14px;color:#fff;position:relative;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.12);box-sizing:border-box}
        .glow{position:absolute;right:-20px;top:-20px;width:100px;height:100px;background:rgba(255,255,255,0.1);border-radius:50%;filter:blur(16px)}
        .cTop{display:flex;align-items:center;gap:8px;position:relative;z-index:1}.chip{width:32px;height:22px;background:linear-gradient(135deg,#FFD700,#FFA500);border-radius:5px}.cTop span{font-size:10px;font-weight:900}.def{margin-left:auto;background:#22C55E;padding:3px 8px;border-radius:20px;font-size:9px;font-weight:900}
        .cNum{font-size:15px;font-weight:800;letter-spacing:2px;margin:12px 0 8px 0;position:relative;z-index:1}
        .cBot{display:flex;gap:18px;position:relative;z-index:1;margin-bottom:10px}.cBot label{font-size:7px;opacity:0.7;font-weight:800;display:block}.cBot b{font-size:10px;font-weight:800}
        .cAct{display:flex;gap:8px;position:relative;z-index:1}.ca{flex:1;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.15);color:#fff;font-weight:700;font-size:10px;cursor:pointer}.ca.on{background:#fff;color:#0F172A}.ca.del{background:rgba(239,68,68,0.25)}
        .methods{display:flex;flex-direction:column;gap:8px;overflow:visible}
        .mItem{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:12px;padding:10px 12px;min-height:44px;box-sizing:border-box}
        .mIcon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:11px;flex-shrink:0}.mIcon.bk{background:#00C9A7}.mIcon.ng{background:#E2136E}.mIcon.rk{background:#8C33FF}.mIcon.cd{background:#0F172A}
        .mText{flex:1;min-width:0}.mText b{font-size:12px;display:block;color:#0F172A}.mText span{font-size:10px;color:#64748B}
        .ok{margin-left:auto;background:rgba(34,197,94,0.12);color:#16A34A;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:800;white-space:nowrap;flex-shrink:0}.mBtn{margin-left:auto;height:26px;padding:0 10px;background:#0F172A;color:#fff;border:0;border-radius:20px;font-weight:700;font-size:10px;cursor:pointer;flex-shrink:0}
        .payBox{background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:16px;padding:14px;margin-top:14px;box-shadow:0 4px 16px rgba(0,0,0,0.04);box-sizing:border-box;overflow:visible}
        .row{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px}.row span{color:#64748B}.row b{color:#0F172A}.green{color:#16A34A !important}.line{height:1px;background:rgba(0,0,0,0.06);margin:10px 0}.row.total b{font-size:16px}
        .payBtn{width:100%;height:44px;background:linear-gradient(135deg,#FF6B35,#F97316);color:#fff;border:0;border-radius:12px;font-weight:900;font-size:13px;cursor:pointer;box-shadow:0 6px 18px rgba(255,107,53,0.3);margin-top:8px}
        .safe{text-align:center;font-size:10px;color:#94A3B8;margin:8px 0 0 0}

        /* PHONE - Standard Light Background, No Black */
        @media(max-width:768px){
          .dWrap{display:none}
          .pWrap{display:flex;justify-content:center;padding:12px;background:#F8FAFC;min-height:auto;width:100%;box-sizing:border-box}
          .mainWrap{padding:0;background:#F8FAFC;min-height:auto}
          .iphone{width:100%;max-width:380px;background:#000;border-radius:40px;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,0.18);position:relative;margin:0 auto;box-sizing:border-box}
          .notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:90px;height:20px;background:#000;border-radius:0 0 12px 12px;z-index:10}
          .screen{background:#fff;border-radius:32px;overflow:hidden;min-height:auto;display:flex;flex-direction:column;box-sizing:border-box;padding-bottom:12px}
          .homeBar{width:100px;height:4px;background:#000;border-radius:10px;position:absolute;bottom:10px;left:50%;transform:translateX(-50%);opacity:0.7}
          .pHead{padding:36px 16px 10px 16px;display:flex;justify-content:space-between;align-items:flex-start;background:#fff}
          .pHead h1{margin:0;font-size:20px;font-weight:900;color:#0F172A}.pHead p{margin:2px 0 0 0;font-size:11px;color:#64748B;font-weight:600}
          .pAdd{width:36px;height:36px;border-radius:50%;background:#0F172A;color:#fff;border:0;font-size:16px;cursor:pointer}
          .pBal{margin:0 14px;background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:14px;padding:12px 14px;color:#fff;position:relative;overflow:hidden}
          .pBal span{font-size:8px;opacity:0.6;font-weight:700}.pBal b{font-size:18px;font-weight:900;display:block;margin-top:2px}.pBlur{position:absolute;right:-15px;top:-15px;width:70px;height:70px;background:radial-gradient(circle,rgba(255,107,53,0.3),transparent 70%)}
          .pSec{padding:12px 12px 0 12px}.pTitle{display:flex;gap:6px;align-items:center;margin-bottom:8px}.pTitle b{font-size:12px;font-weight:900}.pTitle span{background:#0F172A;color:#fff;font-size:9px;padding:2px 6px;border-radius:20px;font-weight:800}
          .pScroll{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px}.pScroll::-webkit-scrollbar{display:none}
          .pCard{min-width:240px;max-width:240px;height:130px;border-radius:14px;padding:12px;color:#fff;flex-shrink:0;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 20px rgba(0,0,0,0.12)}
          .pTop{display:flex;justify-content:space-between;align-items:center}.pNum{font-size:13px;font-weight:800;letter-spacing:1.5px;margin:8px 0 6px 0}.pBot{display:flex;gap:12px;align-items:flex-end}.pBot label{font-size:6px;opacity:0.7;font-weight:800;display:block}.pBot b{font-size:9px;font-weight:800}.pDef{margin-left:auto;background:#22C55E;padding:2px 6px;border-radius:20px;font-size:7px;font-weight:900}
          .pList{padding:8px 12px 0 12px;display:flex;flex-direction:column;gap:6px}.pRow{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:8px 10px}.pIcon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:10px;flex-shrink:0}.pInfo{flex:1;min-width:0}.pInfo b{font-size:10px;display:block;color:#0F172A}.pInfo span{font-size:9px;color:#64748B}.pb{height:22px;padding:0 8px;border-radius:20px;border:1px solid #E2E8F0;background:#fff;font-size:9px;font-weight:800;cursor:pointer;flex-shrink:0}.pb.on{background:#0F172A;color:#fff;border-color:#0F172A}.pb.del{color:#EF4444;width:22px;padding:0}
          .pMethods{padding:8px 12px 0 12px;display:flex;flex-direction:column;gap:6px}
          .pPay{padding:12px 12px 24px 12px;margin-top:8px}.pPayBtn{width:100%;height:42px;background:linear-gradient(135deg,#FF6B35,#F97316);color:#fff;border:0;border-radius:12px;font-size:12px;font-weight:900;box-shadow:0 8px 20px rgba(255,107,53,0.3)}.pPay p{text-align:center;font-size:9px;color:#94A3B8;margin-top:6px;font-weight:600}
        }

        .modalBg{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;box-sizing:border-box}
        .modal{width:100%;max-width:360px;background:#fff;border-radius:18px;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:pop .25s ease;box-sizing:border-box}
        @keyframes pop{from{transform:scale(0.96);opacity:0}to{transform:scale(1);opacity:1}}
        .mHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.mHead h3{margin:0;font-size:14px;font-weight:900}.mHead button{width:28px;height:28px;border-radius:50%;border:1px solid #E2E8F0;background:#fff;cursor:pointer}
        .form{display:flex;flex-direction:column;gap:8px}.form label{font-size:8px;font-weight:900;color:#0F172A}.form input{height:40px;border:1px solid #E2E8F0;border-radius:10px;padding:0 10px;font-size:12px;font-weight:600;outline:none;width:100%;box-sizing:border-box}.two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .save{height:40px;background:#0F172A;color:#fff;border:0;border-radius:10px;font-size:12px;font-weight:900;cursor:pointer;margin-top:4px}
      `}</style>
    </div>
  );
}