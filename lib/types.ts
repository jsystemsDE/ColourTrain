export interface TrainingConfigData {
  interval: string;
  intervalMode: 'fixed' | 'random';
  randomMin: string;
  randomMax: string;
  colors: string[];
  sounds: string[];
}

export interface TrainingConfig {
  id: string;
  user_id: string;
  variant_index: number;
  variant_name: string;
  config_data: TrainingConfigData;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  profile_picture_url: string | null;
  created_at: string;
}