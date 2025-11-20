"use client";

import { useMemo, useState } from "react";
import { type ChannelsDictionary } from "@/i18n/getChannelsDictionary";
import { ChannelService } from "@/lib/services/channel-service";
import { ChannelType } from "@/lib/services/channel-types";

type WizardProps = {
  locale: string;
  triggerLabel: string;
  dict: ChannelsDictionary;
};

type Step = "type" | "settings" | "credentials" | "review";

type FormState = {
  type: ChannelType | null;
  region: string;
  accountType: string;
  accountId: string;
  autoSync: {
    products: boolean;
    inventory: boolean;
    orders: boolean;
    pricing: boolean;
    reviews: boolean;
  };
  cadence: "15m" | "hourly" | "daily";
  credentials: { apiKey: string; apiSecret: string; redirectUrl: string };
  acceptPolicy: boolean;
};

const defaultState: FormState = {
  type: null,
  region: "JP",
  accountType: "Seller Central",
  accountId: "",
  autoSync: {
    products: true,
    inventory: true,
    orders: true,
    pricing: true,
    reviews: false,
  },
  cadence: "hourly",
  credentials: { apiKey: "", apiSecret: "", redirectUrl: "https://app.astracommerce.com/callback" },
  acceptPolicy: false,
};

const marketplaceBadgeHints: Partial<Record<ChannelType, string>> = {
  AMAZON: "JP / US / EU",
  SHOPIFY: "D2C",
};

export function AddChannelWizard({ locale: _locale, triggerLabel, dict }: WizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("type");
  const [form, setForm] = useState<FormState>(defaultState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [connected, setConnected] = useState<string | null>(null);

  const steps: Step[] = ["type", "settings", "credentials", "review"];
  const currentIndex = steps.indexOf(step);

  const canNext = useMemo(() => {
    if (step === "type" && !form.type) return false;
    if (step === "credentials") {
      return Boolean(form.credentials.apiKey && form.credentials.apiSecret);
    }
    if (step === "review" && !form.acceptPolicy) return false;
    return true;
  }, [form.acceptPolicy, form.credentials.apiKey, form.credentials.apiSecret, form.type, step]);

  const closeAndReset = () => {
    setOpen(false);
    setStep("type");
    setForm(defaultState);
    setError(null);
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const connection = await ChannelService.provisionChannelConnection("demo-org", {
        name: form.type ? `${form.type} ${form.region}` : dict.title,
        type: form.type ?? "AMAZON",
        region: form.region,
        accountId: form.accountId,
      });
      setConnected(connection.name);
      closeAndReset();
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.wizard.error);
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (partial: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  void _locale;

  const marketplaceOptions = useMemo(
    () =>
      (Object.keys(dict.wizard.marketplaces) as ChannelType[]).map((type) => ({
        type,
        label: dict.wizard.marketplaces[type].label,
        desc: dict.wizard.marketplaces[type].desc,
        badge: marketplaceBadgeHints[type],
      })),
    [dict.wizard.marketplaces],
  );

  return (
    <>
      <button
        id="add-channel-button"
        type="button"
        className="btn btn-primary"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>
      {connected ? (
        <p className="text-xs text-accent-success">
          ✓ {connected} {dict.common.connectedToast}
        </p>
      ) : null}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
          <div className="w-full max-w-4xl rounded-panel border border-default bg-surface p-6 shadow-token-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary">{dict.wizard.title}</h2>
                <p className="text-sm text-secondary">{dict.wizard.subtitle}</p>
              </div>
              <button
                type="button"
                className="text-secondary hover:text-primary"
                onClick={closeAndReset}
              >
                ✕
              </button>
            </div>
            <Progress steps={steps} labels={dict.wizard.steps} currentIndex={currentIndex} />
            <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              {step === "type" && (
                <StepType
                  value={form}
                  onChange={updateForm}
                  dict={dict}
                  options={marketplaceOptions}
                />
              )}
              {step === "settings" && (
                <StepSettings
                  value={form}
                  onChange={updateForm}
                  dict={dict}
                />
              )}
              {step === "credentials" && (
                <StepCredentials
                  value={form}
                  onChange={updateForm}
                  dict={dict}
                />
              )}
              {step === "review" && <StepReview value={form} dict={dict} onChange={updateForm} />}
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep((prev) => steps[Math.max(0, steps.indexOf(prev) - 1)])}
                disabled={currentIndex === 0}
              >
                {dict.wizard.back}
              </button>
              <div className="flex items-center gap-2">
                {step !== "review" ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!canNext}
                    onClick={() => {
                      if (step === "credentials" && !form.credentials.apiKey) {
                        setError(dict.wizard.validation.credentials);
                        return;
                      }
                      setError(null);
                      setStep((prev) => steps[Math.min(steps.length - 1, steps.indexOf(prev) + 1)]);
                    }}
                  >
                    {dict.wizard.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                  onClick={onSubmit}
                  disabled={submitting || !canNext}
                >
                  {submitting ? dict.common.saving : dict.wizard.connect}
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const Progress = ({
  steps,
  labels,
  currentIndex,
}: {
  steps: Step[];
  labels: ChannelsDictionary["wizard"]["steps"];
  currentIndex: number;
}) => (
  <div className="mt-3 grid grid-cols-4 gap-2">
    {steps.map((s, idx) => {
      const label = labels[s];
      return (
        <div
          key={s}
          className={`rounded-card border px-3 py-2 ${idx <= currentIndex ? "border-accent-primary bg-accent-primary-soft" : "border-default bg-surface-muted"}`}
        >
          <p className="text-xs font-semibold text-primary">
            {idx + 1}. {label.title}
          </p>
          <p className="text-[11px] text-muted">{label.description}</p>
        </div>
      );
    })}
  </div>
);

const StepType = ({
  value,
  onChange,
  dict,
  options,
}: {
  value: FormState;
  onChange: (partial: Partial<FormState>) => void;
  dict: ChannelsDictionary;
  options: { type: ChannelType; label: string; desc: string; badge?: string }[];
}) => (
  <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-3">
      {options.map((opt) => (
        <button
          key={opt.type}
          type="button"
          className={`rounded-card border px-4 py-3 text-left transition ${
            value.type === opt.type
              ? "border-accent-primary bg-accent-primary-soft shadow-token-md"
              : "border-default bg-surface hover:border-accent-primary hover:shadow-token-sm"
          }`}
          onClick={() => onChange({ type: opt.type })}
        >
          <p className="text-sm font-semibold text-primary">{opt.label}</p>
          <p className="text-xs text-secondary">{opt.desc}</p>
          {opt.badge ? (
            <span className="mt-2 inline-flex rounded-pill bg-surface-muted px-2 py-1 text-[10px] font-semibold text-muted">
              {opt.badge}
            </span>
          ) : null}
        </button>
      ))}
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      <Selector
        label={dict.wizard.region}
        options={["JP", "US", "EU", "SEA", "Global"]}
        value={value.region}
        onChange={(region) => onChange({ region })}
      />
      <Selector
        label={dict.wizard.accountType}
        options={["Seller Central", "Vendor", "Admin API", "Partner"]}
        value={value.accountType}
        onChange={(accountType) => onChange({ accountType })}
      />
      <Input
        label={dict.wizard.accountId}
        placeholder={dict.wizard.placeholders.accountId}
        value={value.accountId}
        onChange={(accountId) => onChange({ accountId })}
      />
    </div>
  </div>
);

const StepSettings = ({
  value,
  onChange,
  dict,
}: {
  value: FormState;
  onChange: (partial: Partial<FormState>) => void;
  dict: ChannelsDictionary;
}) => (
  <div className="space-y-3">
    <ToggleRow
      label={dict.wizard.syncProducts}
      checked={value.autoSync.products}
      onChange={(checked) => onChange({ autoSync: { ...value.autoSync, products: checked } })}
    />
    <ToggleRow
      label={dict.wizard.syncInventory}
      checked={value.autoSync.inventory}
      onChange={(checked) => onChange({ autoSync: { ...value.autoSync, inventory: checked } })}
    />
    <ToggleRow
      label={dict.wizard.syncOrders}
      checked={value.autoSync.orders}
      onChange={(checked) => onChange({ autoSync: { ...value.autoSync, orders: checked } })}
    />
    <ToggleRow
      label={dict.wizard.syncPricing}
      checked={value.autoSync.pricing}
      onChange={(checked) => onChange({ autoSync: { ...value.autoSync, pricing: checked } })}
    />
    <ToggleRow
      label={dict.wizard.syncReviews}
      checked={value.autoSync.reviews}
      onChange={(checked) => onChange({ autoSync: { ...value.autoSync, reviews: checked } })}
    />
    <div className="grid gap-3 sm:grid-cols-3">
      {(["15m", "hourly", "daily"] as const).map((cadence) => (
        <button
          key={cadence}
          type="button"
          className={`rounded-card border px-3 py-2 text-left text-sm font-semibold ${
            value.cadence === cadence
              ? "border-accent-primary bg-accent-primary-soft text-primary"
              : "border-default text-secondary hover:border-accent-primary"
          }`}
          onClick={() => onChange({ cadence })}
        >
          {dict.wizard.frequency[cadence]}
        </button>
      ))}
    </div>
  </div>
);

const StepCredentials = ({
  value,
  onChange,
  dict,
}: {
  value: FormState;
  onChange: (partial: Partial<FormState>) => void;
  dict: ChannelsDictionary;
}) => (
  <div className="space-y-4">
    <p className="text-sm text-secondary">
      {dict.wizard.steps.credentials.description}
    </p>
    <div className="grid gap-3 sm:grid-cols-2">
      <Input
        label={dict.wizard.apiKey}
        placeholder={dict.wizard.placeholders.apiKey}
        value={value.credentials.apiKey}
        onChange={(apiKey) => onChange({ credentials: { ...value.credentials, apiKey } })}
      />
      <Input
        label={dict.wizard.apiSecret}
        placeholder={dict.wizard.placeholders.apiSecret}
        type="password"
        value={value.credentials.apiSecret}
        onChange={(apiSecret) => onChange({ credentials: { ...value.credentials, apiSecret } })}
      />
      <Input
        label={dict.wizard.redirectUrl}
        placeholder={dict.wizard.placeholders.redirectUrl}
        value={value.credentials.redirectUrl}
        onChange={(redirectUrl) => onChange({ credentials: { ...value.credentials, redirectUrl } })}
      />
      <Input
        label={dict.wizard.accountId}
        placeholder={dict.wizard.placeholders.accountId}
        value={value.accountId}
        onChange={(accountId) => onChange({ accountId })}
      />
    </div>
  </div>
);

const StepReview = ({
  value,
  dict,
  onChange,
}: {
  value: FormState;
  dict: ChannelsDictionary;
  onChange: (partial: Partial<FormState>) => void;
}) => (
  <div className="space-y-3">
    <div className="rounded-card border border-default bg-surface-muted p-4 shadow-soft">
      <p className="text-sm font-semibold text-primary">{dict.wizard.review}</p>
      <ul className="mt-2 space-y-1 text-sm text-secondary">
        <li>
          {dict.filters.type}: <span className="font-semibold text-primary">{value.type ?? "-"}</span>
        </li>
        <li>
          {dict.wizard.region}: {value.region} · {dict.wizard.accountType}: {value.accountType}
        </li>
        <li>
          {dict.wizard.accountId}: {value.accountId || "—"}
        </li>
        <li>
          {dict.wizard.syncSchedule}: {dict.wizard.frequency[value.cadence]}
        </li>
      </ul>
    </div>
    <div className="rounded-card border border-default bg-surface-muted p-4 shadow-soft">
      <p className="text-sm font-semibold text-primary">{dict.wizard.syncSchedule}</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 text-sm text-secondary">
        {Object.entries(value.autoSync).map(([k, v]) => (
          <li key={k} className="flex items-center justify-between rounded-pill border border-default bg-surface px-3 py-2">
            <span className="capitalize">{k}</span>
            <span className={`text-xs font-semibold ${v ? "text-accent-success" : "text-muted"}`}>
              {v ? dict.common.enabled : dict.common.disabled}
            </span>
          </li>
        ))}
      </ul>
    </div>
    <label className="flex items-center gap-2 text-sm text-secondary">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-default"
        checked={value.acceptPolicy}
        onChange={(e) => onChange({ acceptPolicy: e.target.checked })}
      />
      {dict.wizard.policy}
    </label>
  </div>
);

const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-card border border-default bg-surface-muted px-3 py-2 shadow-soft">
    <span className="text-sm font-semibold text-primary">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-accent-primary" : "bg-default"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) => (
  <label className="flex flex-col gap-1 text-sm text-primary">
    {label}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
    />
  </label>
);

const Selector = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) => (
  <label className="flex flex-col gap-1 text-sm text-primary">
    {label}
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-card border px-3 py-2 text-sm font-semibold ${
            value === opt
              ? "border-accent-primary bg-accent-primary-soft text-primary"
              : "border-default text-secondary hover:border-accent-primary"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </label>
);
