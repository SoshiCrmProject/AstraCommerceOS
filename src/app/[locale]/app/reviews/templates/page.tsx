import { getReviewsDictionary } from '@/i18n/getReviewsDictionary';
import { PageHeader } from '@/components/app/page-header';
import { TemplatesView } from '@/components/reviews/templates-view';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getReviewsDictionary(locale);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={dict.templates.title}
        subtitle={dict.templates.subtitle}
      />

      <TemplatesView dict={dict} locale={locale} />
    </div>
  );
}
