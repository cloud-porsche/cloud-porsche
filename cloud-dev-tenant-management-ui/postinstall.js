import { readFileSync, writeFileSync } from "fs";

// Zielpfad zu der Datei innerhalb von node_modules
const targetFile = "./node_modules/@nuxt/ui-pro/modules/pro/index.ts";

// Zeile, die auskommentiert werden soll
const zeileZuKommentieren =
  "await validateLicense({ key, theme, dir: nuxt.options.rootDir })";

try {
  // Datei einlesen
  const fileContent = readFileSync(targetFile, "utf-8");

  // Prüfen, ob die Zeile vorhanden ist
  if (fileContent.includes(zeileZuKommentieren)) {
    // Zeile auskommentieren
    const updatedContent = fileContent.replace(
      zeileZuKommentieren,
      `// ${zeileZuKommentieren}`,
    );

    // Datei überschreiben
    writeFileSync(targetFile, updatedContent, "utf-8");
    console.log("Zeile erfolgreich auskommentiert.");
  } else {
    console.log("Die Zielzeile wurde nicht gefunden.");
  }
} catch (error) {
  console.error("Fehler beim Bearbeiten der Datei:", error);
}
