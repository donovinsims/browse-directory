import { Link, useNavigate } from 'react-router-dom'
import { usePageMeta } from '../lib/meta'
import { useAuth } from '../providers/AuthProvider'
import { useToast } from '../providers/ToastProvider'
import { CheckIcon } from '../components/Icons'

interface Tier {
  name: string
  price: string
  features: string[]
}

const FREE: Tier = {
  name: 'Free',
  price: '$0',
  features: ['Access the complete index', 'Future additions included'],
}
const PAID: Tier = {
  name: 'Bookmarking',
  price: '$8',
  features: [
    'Access the complete index',
    'Future additions included',
    'Bookmark & save sites to your account',
  ],
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2.5">
          <CheckIcon className="text-text-muted mt-[3px] shrink-0" />
          <span className="text-[15px] tracking-[-0.1px] text-text-primary">{f}</span>
        </li>
      ))}
    </ul>
  )
}

function Price({ tier }: { tier: Tier }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="type-stat">{tier.price}</span>
      <span className="type-caption text-text-muted">USD/Month</span>
    </div>
  )
}

export function Pricing() {
  usePageMeta('Pricing', 'Browse for free, or unlock bookmarking for $8/month.')
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const onUpgrade = () => {
    if (!user) {
      void navigate('/signup?plan=bookmarking')
      return
    }
    // STRIPE PLACEHOLDER — checkout intentionally stubbed.
    toast('Payments are coming soon — checkout is a placeholder in this build.')
  }

  return (
    <div className="shell">
      <section className="pt-16 text-center">
        <h1 className="type-display">Pricing</h1>
        <p className="type-lede text-text-muted mt-4 max-w-[640px] mx-auto">
          Create an account to unlock bookmarking websites.
        </p>
      </section>

      <section className="max-w-[832px] mx-auto mt-14">
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
          {/* Free tier */}
          <div className="rounded-[11px] ring-hairline p-6 flex flex-col gap-6">
            <h2 className="type-card-title">{FREE.name}</h2>
            <Price tier={FREE} />
            <FeatureList features={FREE.features} />
            <Link to="/" className="btn-secondary mt-auto w-full">
              Browse for Free
            </Link>
          </div>

          {/* Paid tier — alternating raised panel */}
          <div className="rounded-[11px] ring-hairline bg-surface-raised p-6 flex flex-col gap-6">
            <h2 className="type-card-title">{PAID.name}</h2>
            <Price tier={PAID} />
            <FeatureList features={PAID.features} />
            <div className="mt-auto flex flex-col gap-2">
              <button type="button" onClick={onUpgrade} className="btn-cta w-full">
                Sign up now
              </button>
              <p className="type-caption text-text-muted">
                Payments coming soon — checkout is stubbed in this build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
