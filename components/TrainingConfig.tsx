'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import supabase from '@/lib/supabaseClient';
import { TrainingConfigData } from '@/lib/types';
import ColorSlot from '@/components/ColorSlot';
import SoundSelector from '@/components/SoundSelector';

interface TrainingConfigProps {
  variantIndex: number;
}

const DEFAULT_CONFIG: TrainingConfigData = {
  interval: '1000',
  intervalMode: 'fixed',
  randomMin: '1',
  randomMax: '3',
  colors: ['#FF4A4A', '#00FFA3', '#FFD700', '#FFFFFF'],
  sounds: ['beep'],
};

const TrainingConfig = ({ variantIndex }: TrainingConfigProps) => {
  const router = useRouter();
  const [config, setConfig] = useState<TrainingConfigData>(DEFAULT_CONFIG);
  const [selectedSound, setSelectedSound] = useState(DEFAULT_CONFIG.sounds[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('training_configs')
        .select('*')
        .eq('user_id', user.id)
        .eq('variant_index', variantIndex)
        .single();

      if (data?.config_data) {
        const configData = data.config_data as TrainingConfigData;
        setConfig({
          ...DEFAULT_CONFIG,
          ...configData,
        });
        setSelectedSound(configData.sounds?.[0] ?? 'beep');
      }

      setLoading(false);
    };

    fetchConfig();
  }, [variantIndex]);

  const handleColorChange = (index: number, color: string) => {
    setConfig((prev) => {
      const colors = [...prev.colors];
      colors[index] = color;
      return { ...prev, colors };
    });
  };

  const saveConfig = async (): Promise<boolean> => {
    setSaving(true);
    setMessage('');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return false;
    }

    const configToSave: TrainingConfigData = {
      ...config,
      sounds: [selectedSound],
    };

    const { error } = await supabase.from('training_configs').upsert(
      {
        user_id: user.id,
        variant_index: variantIndex,
        variant_name: `variant ${variantIndex}`,
        config_data: configToSave,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,variant_index' }
    );

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return false;
    }

    setConfig(configToSave);
    setMessage('Config saved.');
    return true;
  };

  const handleSave = async () => {
    await saveConfig();
  };

  const handleStartTraining = async () => {
    const saved = await saveConfig();
    if (saved) router.push(`/training/${variantIndex}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-background">
        <p className="text-muted-text">loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base-background px-4 py-24">
      <header className="absolute left-4 top-4 flex items-center space-x-2">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <FiArrowLeft className="h-6 w-6 text-primary-text" />
          <h1 className="text-xl font-bold">variant {variantIndex}</h1>
        </Link>
      </header>
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-4">
          {config.colors.map((color, index) => (
            <ColorSlot
              key={index}
              color={color}
              index={index}
              onChange={handleColorChange}
            />
          ))}
        </div>

        {/* NEU: Umschalter fest / zufällig */}
        <div>
          <label className="mb-2 block text-sm text-muted-text">zeitraum neue farbe</label>
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, intervalMode: 'fixed' }))}
              className={`flex-1 rounded border px-4 py-2 ${
                config.intervalMode === 'fixed'
                  ? 'border-sniper-highlight text-sniper-highlight'
                  : 'border-muted-text text-muted-text'
              }`}
            >
              fest
            </button>
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, intervalMode: 'random' }))}
              className={`flex-1 rounded border px-4 py-2 ${
                config.intervalMode === 'random'
                  ? 'border-sniper-highlight text-sniper-highlight'
                  : 'border-muted-text text-muted-text'
              }`}
            >
              zufällig
            </button>
          </div>

          {config.intervalMode === 'fixed' ? (
            <input
              type="number"
              value={config.interval}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, interval: e.target.value }))
              }
              placeholder="millisekunden"
              className="w-full rounded border border-muted-text bg-container-cards p-3 text-primary-text"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={config.randomMin}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, randomMin: e.target.value }))
                }
                placeholder="min sek"
                className="w-full rounded border border-muted-text bg-container-cards p-3 text-primary-text"
              />
              <input
                type="number"
                value={config.randomMax}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, randomMax: e.target.value }))
                }
                placeholder="max sek"
                className="w-full rounded border border-muted-text bg-container-cards p-3 text-primary-text"
              />
            </div>
          )}
        </div>

        <SoundSelector
          sounds={config.sounds}
          selectedSound={selectedSound}
          onChange={setSelectedSound}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded border border-muted-text px-6 py-3 text-primary-text disabled:opacity-50"
        >
          {saving ? 'saving...' : 'save config'}
        </button>
        <button
          onClick={handleStartTraining}
          className="rounded bg-sniper-highlight px-6 py-3 text-black"
        >
          start training
        </button>
        {message && (
          <p
            className={`text-center ${
              message === 'Config saved.' ? 'text-sniper-highlight' : 'text-alert-red'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrainingConfig;