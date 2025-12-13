import crypto from "crypto";

function hashFingerprint(fp: string) {
  const hashedFingerprint = crypto
    .createHash("sha256")
    .update(fp || "")
    .digest("hex");
  return hashedFingerprint;
}

export { hashFingerprint };
