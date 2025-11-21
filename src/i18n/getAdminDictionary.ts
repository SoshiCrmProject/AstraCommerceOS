export async function getAdminDictionary(locale: 'en' | 'ja') {
  const dict = await import(`./locales/${locale}/app.admin.json`);
  return dict.default;
}
