export interface Sentence {
  id: number;
  file: string;
  transcription: string;
  recorded: boolean;
  isRecording?: boolean;
  sub_dataset: SubDataSet;
  dataset: SentenceID;
  start_time: number;
  end_time: number;
  speaker: SpeakerID;
  speaker_name: SpeakerName;
  emotion: Emotion;
}

export type SpeakerID = Speaker["id"];
export type SpeakerName = Speaker["name"];
export type SentenceID = Sentence["id"];
export enum SentenceStatus {
  ALL = -1,
  PENDIND = 0,
  RECORDED = 1,
}

export interface SentenceResponse {
  count: number;
  subDataSet: SubDataSet;
  sentence: Sentence[];
}

export interface Dataset {
  id: number;
  name: string;
  transcription: string;
  creation_date: string;
}
export interface DatasetResponse {
  count: number;
  dataset: Dataset[];
}
export type DatasetID = Dataset["id"];

export enum SubDataSet {
  TRAIN = "train",
  TEST = "test",
  VALIDATION = "validation",
}

export enum Emotion {
  HAPPY = "开心",
  SAD = "悲伤",
  ANGRY = "愤怒",
  FEARFUL = "恐惧",
  SURPRISED = "惊讶",
  DISGUSTED = "厌恶",
  NEUTRAL = "中性"
}

export interface Entity {
  value: number;
  label: string;
  icon: string;
}

export interface Speaker {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  accent?: string;
}

export interface TranscriptionFile {
  file: File;
  emotion: Emotion;
  speaker: SpeakerID;
}