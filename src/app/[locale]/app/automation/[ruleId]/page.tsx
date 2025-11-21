import { Suspense } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { RuleBuilderContent } from './rule-builder-content';

export const metadata = {
  title: 'Automation Workflow Builder',
};

type Props = {
  params: Promise<{ locale: string; ruleId: string }>;
};

export default async function RuleBuilderPage({ params }: Props) {
  const { locale, ruleId } = await params;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={ruleId === 'new' ? 'Create Workflow' : 'Edit Workflow'}
        subtitle="Configure triggers, conditions, and actions for your automation rule"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div className="text-secondary">Loading...</div>}>
          <RuleBuilderContent locale={locale} ruleId={ruleId} />
        </Suspense>
      </div>
    </div>
  );
}
