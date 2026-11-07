
import { useState } from "react";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

const PROMPTPAY_ID = "0991301221";

export default function App() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createQR() {
    setError("");
    setResult(null);

    const base = Number(amount);

    if (!Number.isFinite(base) || base <= 0 || base > 1000000) {
      setError("กรุณากรอกยอดเงินให้ถูกต้อง");
      return;
    }

    setLoading(true);

    try {
      const baseSatang = Math.round(base * 100);
      const randomSatang = Math.floor(Math.random() * 99) + 1;
      const totalSatang = baseSatang + randomSatang;
      const finalAmount = totalSatang / 100;

      const payload = generatePayload(PROMPTPAY_ID, {
        amount: finalAmount
      });

      const qrImage = await QRCode.toDataURL(payload, {
        width: 420,
        margin: 3,
        errorCorrectionLevel: "H"
      });

      setResult({
        amount: finalAmount,
        qr: qrImage,
        reference: "FF" + Date.now().toString().slice(-8),
        createdAt: new Date().toLocaleString("th-TH")
      });
    } catch (err) {
      console.error(err);
      setError("สร้าง QR Code ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result.qr;
    link.download = `Friend-Follow-${result.reference}.png`;
    link.click();
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logo">FF</div>
          <div>
            <h2>Friend Follow</h2>
            <small>OFFICIAL PAYMENT SYSTEM</small>
          </div>
        </div>
        <div className="secure">● SECURE PAYMENT</div>
      </header>

      <section className="hero">
        <div className="eyebrow">FRIEND FOLLOW OFFICIAL</div>
        <h1>Payment<br /><span>Generator.</span></h1>
        <p>ระบบสร้าง QR Code รับชำระเงิน พร้อมกำหนดยอดชำระอัตโนมัติ</p>
      </section>

      <section className="panel">
        {!result ? (
          <>
            <h2>สร้างรายการชำระเงิน</h2>
            <p className="muted">กรอกยอดเงินที่ต้องการเรียกเก็บ</p>

            <div className="account-box">
              <small>หมายเลขรับเงิน PromptPay</small>
              <h3>099-130-1221</h3>
              <span>FRIEND FOLLOW</span>
            </div>

            <label>ยอดเงินที่ต้องการเรียกเก็บ (บาท)</label>
            <div className="amount-input">
              <span>฿</span>
              <input
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="info">
              ระบบสุ่มเศษสตางค์เพิ่มเติม 0.01–0.99 บาท
            </div>

            {error && <div className="error">{error}</div>}

            <button className="primary" onClick={createQR} disabled={loading}>
              {loading ? "กำลังสร้าง QR..." : "สร้าง QR Code →"}
            </button>
          </>
        ) : (
          <div className="result">
            <div className="success">✓ QR CODE CREATED</div>
            <h2>QR Code สำหรับชำระเงิน</h2>
            <p className="muted">กรุณาสแกน QR Code เพื่อชำระเงิน</p>

            <div className="qr-frame">
              <img src={result.qr} alt="PromptPay QR" />
            </div>

            <div className="qr-warning">
              QR Code นี้ใช้สำหรับโอนเงินให้ร้าน Friend Follow เท่านั้น
            </div>

            <div className="amount-result">
              <small>ยอดชำระเงินทั้งหมด</small>
              <h1>
                {result.amount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} บาท
              </h1>
              <div className="locked">🔒 LOCKED PAYMENT AMOUNT</div>
            </div>

            <div className="details">
              <p>ร้านค้า: Friend Follow</p>
              <p>PromptPay: 099-130-1221</p>
              <p>เลขที่รายการ: {result.reference}</p>
              <p>วันที่สร้าง: {result.createdAt}</p>
            </div>

            <button className="primary" onClick={downloadQR}>
              ↓ ดาวน์โหลด QR Code
            </button>

            <button className="secondary" onClick={() => {
              setResult(null);
              setAmount("");
              setError("");
            }}>
              + สร้างรายการใหม่
            </button>
          </div>
        )}
      </section>

      <section className="payment-notice">
        <h3>ช่องทางการชำระเงิน</h3>
        <p>
          รองรับการชำระเงินผ่านแอปพลิเคชันธนาคารที่รองรับ
          มาตรฐาน PromptPay และ TrueMoney Wallet
          ทั้งนี้ขึ้นอยู่กับการรองรับ QR ของผู้ให้บริการ
        </p>
      </section>

      <section className="payment-notice">
        <h3>ประกาศแจ้งเตือน</h3>
        <p>
          QR Code นี้ใช้สำหรับโอนเงินให้ร้าน Friend Follow เท่านั้น
          กรุณาตรวจสอบยอดเงินและชื่อผู้รับก่อนยืนยันการโอน
        </p>
      </section>

      <footer>
        <strong>FRIEND FOLLOW</strong>
        <p>OFFICIAL PAYMENT SYSTEM</p>
        <small>© {new Date().getFullYear()} Friend Follow</small>
      </footer>
    </main>
  );
}
