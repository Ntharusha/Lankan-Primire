import React, { useState, useEffect } from 'react'
import {
  Settings, Save, Bell, Shield, CreditCard, Globe, Palette,
  Mail, Phone, MapPin, CheckCircle, ToggleLeft, ToggleRight, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const SETTINGS_KEY = 'lp_admin_settings'

const defaultSettings = {
  siteName: 'Lankan Premiere',
  siteTagline: 'Experience the Excellence of Sinhala Cinema',
  contactEmail: 'info@lankanpremiere.com',
  contactPhone: '+94 11 234 5678',
  address: 'Colombo 03, Western Province, Sri Lanka',
  currency: 'LKR',
  timezone: 'Asia/Colombo',
  bookingWindowDays: 7,
  maxSeatsPerBooking: 10,
  sessionTimeout: 10,
  maintenanceMode: false,
  allowGuestBooking: false,
  emailNotifications: true,
  smsNotifications: false,
  autoConfirmBookings: true,
  enableDynamicPricing: true,
  dynamicPricingThreshold: 90,
  stripeMode: 'test',
  defaultTicketPrice: 800,
  serviceFeePercent: 5,
}

const Section = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-[2.5rem] overflow-hidden border-white/5"
  >
    <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
      <div className="p-3 bg-primary/10 rounded-2xl">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-lg font-black uppercase tracking-tighter italic">{title}</h2>
    </div>
    <div className="p-8 space-y-6">{children}</div>
  </motion.div>
)

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-gray-700 mt-1">{hint}</p>}
  </div>
)

const Input = ({ value, onChange, type = 'text', ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm font-medium text-white placeholder-gray-600 focus:border-primary/40 transition-all"
    {...props}
  />
)

const Toggle = ({ value, onChange, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-bold text-gray-300">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value ? 'bg-primary' : 'bg-white/10'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
)

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      try { setSettings({ ...defaultSettings, ...JSON.parse(stored) }) } catch { }
    }
  }, [])

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    setSaving(false)
    setSaved(true)
    toast.success('Settings saved successfully!')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Configuration</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">System <span className="text-gradient">Settings</span></h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-primary/30"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General */}
        <Section title="General Info" icon={Globe}>
          <Field label="Site Name">
            <Input value={settings.siteName} onChange={e => update('siteName', e.target.value)} />
          </Field>
          <Field label="Tagline">
            <Input value={settings.siteTagline} onChange={e => update('siteTagline', e.target.value)} />
          </Field>
          <Field label="Currency">
            <select
              value={settings.currency}
              onChange={e => update('currency', e.target.value)}
              className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm font-medium text-white"
            >
              <option value="LKR">LKR — Sri Lankan Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </Field>
          <Field label="Timezone">
            <select
              value={settings.timezone}
              onChange={e => update('timezone', e.target.value)}
              className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm font-medium text-white"
            >
              <option value="Asia/Colombo">Asia/Colombo (UTC+5:30)</option>
              <option value="UTC">UTC</option>
            </select>
          </Field>
        </Section>

        {/* Contact */}
        <Section title="Contact Details" icon={Mail}>
          <Field label="Contact Email">
            <Input type="email" value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
          </Field>
          <Field label="Contact Phone">
            <Input value={settings.contactPhone} onChange={e => update('contactPhone', e.target.value)} />
          </Field>
          <Field label="Address">
            <Input value={settings.address} onChange={e => update('address', e.target.value)} />
          </Field>
        </Section>

        {/* Booking Rules */}
        <Section title="Booking Rules" icon={Shield}>
          <Field label="Booking Window (Days)" hint="How many days in advance users can book tickets">
            <Input type="number" min="1" max="30" value={settings.bookingWindowDays} onChange={e => update('bookingWindowDays', Number(e.target.value))} />
          </Field>
          <Field label="Max Seats Per Booking">
            <Input type="number" min="1" max="20" value={settings.maxSeatsPerBooking} onChange={e => update('maxSeatsPerBooking', Number(e.target.value))} />
          </Field>
          <Field label="Seat Hold Timeout (Minutes)">
            <Input type="number" min="5" max="60" value={settings.sessionTimeout} onChange={e => update('sessionTimeout', Number(e.target.value))} />
          </Field>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <Toggle label="Allow Guest Booking" value={settings.allowGuestBooking} onChange={v => update('allowGuestBooking', v)} />
            <Toggle label="Auto-Confirm Bookings" value={settings.autoConfirmBookings} onChange={v => update('autoConfirmBookings', v)} />
            <Toggle label="Maintenance Mode" value={settings.maintenanceMode} onChange={v => update('maintenanceMode', v)} />
          </div>
        </Section>

        {/* Pricing */}
        <Section title="Pricing & Payments" icon={CreditCard}>
          <Field label="Default Ticket Price (LKR)">
            <Input type="number" min="100" value={settings.defaultTicketPrice} onChange={e => update('defaultTicketPrice', Number(e.target.value))} />
          </Field>
          <Field label="Service Fee (%)">
            <Input type="number" min="0" max="20" value={settings.serviceFeePercent} onChange={e => update('serviceFeePercent', Number(e.target.value))} />
          </Field>
          <Field label="Payment Mode">
            <select
              value={settings.stripeMode}
              onChange={e => update('stripeMode', e.target.value)}
              className="w-full glass-card px-5 py-3 rounded-2xl outline-none border-white/10 text-sm font-medium text-white"
            >
              <option value="test">Test Mode</option>
              <option value="live">Live Mode</option>
            </select>
          </Field>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <Toggle label="Dynamic Pricing (DDP)" value={settings.enableDynamicPricing} onChange={v => update('enableDynamicPricing', v)} />
            {settings.enableDynamicPricing && (
              <Field label="DDP Trigger Threshold (%)" hint="Price increases when occupancy exceeds this %">
                <Input type="number" min="50" max="100" value={settings.dynamicPricingThreshold} onChange={e => update('dynamicPricingThreshold', Number(e.target.value))} />
              </Field>
            )}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
          <div className="space-y-3">
            <Toggle label="Email Notifications" value={settings.emailNotifications} onChange={v => update('emailNotifications', v)} />
            <Toggle label="SMS Notifications" value={settings.smsNotifications} onChange={v => update('smsNotifications', v)} />
          </div>
          <div className="mt-6 p-5 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs text-gray-400 leading-relaxed">
              Booking confirmation emails are sent automatically. SMS requires a Twilio API key configured in the server <code className="text-primary">.env</code> file.
            </p>
          </div>
        </Section>

        {/* System Status */}
        <Section title="System Status" icon={Palette}>
          <div className="space-y-4">
            {[
              { label: 'Database', status: 'Connected', color: 'text-green-500 bg-green-500/10 border-green-500/20' },
              { label: 'Socket.IO', status: 'Active', color: 'text-green-500 bg-green-500/10 border-green-500/20' },
              { label: 'Payment Gateway', status: settings.stripeMode === 'live' ? 'Live Mode' : 'Test Mode', color: settings.stripeMode === 'live' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
              { label: 'Email Service', status: settings.emailNotifications ? 'Enabled' : 'Disabled', color: settings.emailNotifications ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-gray-500 bg-gray-500/10 border-gray-500/20' },
              { label: 'Maintenance Mode', status: settings.maintenanceMode ? 'ON' : 'OFF', color: settings.maintenanceMode ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-green-500 bg-green-500/10 border-green-500/20' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest text-xs">{item.label}</span>
                <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

export default AdminSettings
