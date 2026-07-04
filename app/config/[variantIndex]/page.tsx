import TrainingConfig from '@/components/TrainingConfig';

interface ConfigPageProps {
  params: Promise<{ variantIndex: string }>;
}

export default async function ConfigPage({ params }: ConfigPageProps) {
  const { variantIndex } = await params;
  const index = parseInt(variantIndex, 10);

  return <TrainingConfig variantIndex={index} />;
}
