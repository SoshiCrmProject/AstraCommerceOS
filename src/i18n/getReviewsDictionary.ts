export async function getReviewsDictionary(locale: string) {
  const dict = await import(`./locales/${locale}/app.reviews.json`);
  return dict.default;
}
