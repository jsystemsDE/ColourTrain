'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { TrainingConfigData } from '@/lib/types';
import TrainingLoop from '@/components/TrainingLoop';

interface TrainingPageProps {
  params: Promise<{ variantIndex: string }>;
}

const DEFAULT_CONFIG: TrainingConfigData = {
  interval: '1000',
  colors: ['#FF4A4A', '#00FFA3', '#FFD700', '#FFFFFF'],
  sounds: ['beep'],
};

export default function TrainingPage({ params }: TrainingPageProps) {
  const [config, setConfig] = useState<TrainingConfigData>(DEFAULT_CONFIG);
  const [variantIndex, setVariantIndex] = useState<number | null>(null);

  useEffect(() => {
    params.then(({ variantIndex: indexStr }) => {
      const index = parseInt(indexStr, 10);
      setVariantIndex(index);

      const fetchConfig = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
          .from('training_configs')
          .select('*')
          .eq('user_id', user.id)
          .eq('variant_index', index)
          .single();

        if (data?.config_data) {
          setConfig(data.config_data as TrainingConfigData);
        }
      };

      fetchConfig();
    });
  }, [params]);

  if (variantIndex === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-background">
        <p className="text-muted-text">loading...</p>
      </div>
    );
  }

  return <TrainingLoop config={config} />;
}
