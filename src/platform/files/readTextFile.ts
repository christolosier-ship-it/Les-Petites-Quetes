export async function readTextFile(file: File): Promise<string> {
  if (file.size > 5_000_000) throw new Error('La sauvegarde dépasse la limite de 5 Mo.');
  return file.text();
}
