import admin from "firebase-admin";

let initialized = false;

export function initFirebase() {
  if (initialized) return;

  const sdkJson = process.env.FIREBASE_ADMIN_SDK_JSON;
  if (!sdkJson) {
    console.warn("Firebase Admin SDK not configured - using dev mode");
    return;
  }

  try {
    const serviceAccount = JSON.parse(sdkJson);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
  } catch (e) {
    console.warn("Firebase init failed:", e);
  }
}

export async function verifyFirebaseToken(idToken: string) {
  initFirebase();
  if (!admin.apps.length) {
    // Dev fallback - decode without verification
    const parts = idToken.split(".");
    if (parts.length !== 3) throw new Error("Invalid token");
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return { uid: payload.user_id || payload.sub, email: payload.email };
  }
  return admin.auth().verifyIdToken(idToken);
}
