'use client';

import { Suspense, useState } from 'react';
import { AutomationContent } from '../automation-content';

export function RulesContent({ locale }: { locale: string }) {
  return (
    <Suspense fallback={<div>Loading rules...</div>}>
      <AutomationContent locale={locale} />
    </Suspense>
  );
}
