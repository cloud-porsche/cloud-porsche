import { User } from "firebase/auth";

export function verifiedIfPassword(user: User | null): boolean {
  return (
    user !== null &&
    !user.emailVerified &&
    !!user.providerData.find((p) => p.providerId === "password")
  );
}
