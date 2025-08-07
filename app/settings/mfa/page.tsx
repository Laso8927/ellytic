"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export default function MfaSettingsPage() {
  const { data } = useSession();
  const [qr, setQr] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string>("");
  const [pushStatus, setPushStatus] = useState<string>("");

  // Service worker registration for push
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const startTotp = async () => {
    const res = await fetch("/api/mfa/totp/setup", { method: "POST" });
    const json = await res.json();
    setQr(json.qr);
  };
  const verifyTotp = async () => {
    const res = await fetch("/api/mfa/totp/verify", { method: "POST", body: JSON.stringify({ token }) });
    const json = await res.json();
    setStatus(json.valid ? "TOTP enabled" : "Invalid token");
  };

  const registerPasskey = async () => {
    const resp = await fetch("/api/mfa/webauthn/generate-registration-options");
    const options = await resp.json();
    const attestation = await startRegistration(options);
    const verify = await fetch("/api/mfa/webauthn/verify-registration", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...attestation, expectedChallenge: options.challenge }) });
    const json = await verify.json();
    setStatus(json.verified ? "Passkey registered" : "Passkey failed");
  };

  const testPasskey = async () => {
    const resp = await fetch("/api/mfa/webauthn/generate-authentication-options");
    const options = await resp.json();
    const assertion = await startAuthentication(options);
    const verify = await fetch("/api/mfa/webauthn/verify-authentication", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...assertion, expectedChallenge: options.challenge }) });
    const json = await verify.json();
    setStatus(json.verified ? "Passkey verified" : "Passkey verify failed");
  };

  const subscribePush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("Push not supported");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      setPushStatus("Notifications not allowed");
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    const vapidPublicKey = (await (await fetch("/api/push/vapid-public-key")).json()).publicKey as string;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) });
    await fetch("/api/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sub) });
    setPushStatus("Push subscribed");
  };

  const sendTestPush = async () => {
    const res = await fetch("/api/push/send", { method: "POST" });
    setPushStatus(res.ok ? "Push sent" : "Push failed");
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Security Settings</h1>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">TOTP Authenticator</h2>
        {!qr ? (
          <button className="bg-blue-600 text-white px-4 py-2" onClick={startTotp}>Start TOTP Setup</button>
        ) : (
          <div className="space-y-3">
            <img src={qr} alt="TOTP QR" className="w-48 h-48" />
            <input className="border p-2" placeholder="6-digit code" value={token} onChange={(e) => setToken(e.target.value)} />
            <button className="bg-green-600 text-white px-4 py-2" onClick={verifyTotp}>Verify</button>
            {status && <p className="text-sm">{status}</p>}
          </div>
        )}
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Passkeys (WebAuthn)</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2" onClick={registerPasskey}>Register Passkey</button>
          <button className="bg-gray-700 text-white px-4 py-2" onClick={testPasskey}>Test Authenticate</button>
        </div>
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Push-based Approval</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2" onClick={subscribePush}>Subscribe</button>
          <button className="bg-gray-700 text-white px-4 py-2" onClick={sendTestPush}>Send Test Push</button>
        </div>
        {pushStatus && <p className="text-sm">{pushStatus}</p>}
      </section>
    </main>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

