import 'server-only';

export async function getAIDictionary(locale: string) {
  const dict = await import(`./locales/${locale}/app.ai.json`);
  return dict.default || dict;
}
