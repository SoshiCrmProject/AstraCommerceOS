'use client';

import { useState, useEffect } from 'react';
import { PricingService } from '@/lib/services/pricing-service';
import { ExperimentsTable } from '@/components/pricing/experiments-table';
import type { PricingExperiment } from '@/lib/services/pricing-types';

type Props = { locale: string };

export function ExperimentsContent({ locale }: Props) {
  const [experiments, setExperiments] = useState<PricingExperiment[]>([]);

  useEffect(() => {
    const loadExperiments = async () => {
      const data = await PricingService.getPricingExperiments('org-123');
      setExperiments(data);
    };
    loadExperiments();
  }, []);

  const runningExperiments = experiments.filter((e) => e.status === 'RUNNING');
  const completedExperiments = experiments.filter((e) => e.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">Pricing A/B Experiments</h2>
          <p className="text-sm text-secondary">Test and optimize pricing strategies</p>
        </div>
        <button className="px-4 py-2 bg-accent text-white rounded-card font-medium text-sm hover:bg-accent/90 transition-colors">
          + New Experiment
        </button>
      </div>

      {runningExperiments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3">Running Experiments</h3>
          <ExperimentsTable experiments={runningExperiments} />
        </div>
      )}

      {completedExperiments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3">Completed Experiments</h3>
          <ExperimentsTable experiments={completedExperiments} />
        </div>
      )}

      {experiments.length === 0 && (
        <div className="text-center text-secondary py-12">
          No experiments found. Create your first experiment to start testing pricing strategies.
        </div>
      )}
    </div>
  );
}
