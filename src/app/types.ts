export type additionData = {
  transaction_id: string;
  amount: number;
  user_id: string;
};

export type aiModule = {
  getCompletions: (
    params: { messages: message[] },
    userId: string,
    modelKey: string
  ) => Promise<Response>;
};

export type imageModule = {
  generateImage: (
    params: {
      message: string;
      imageBase64: string;
      size: size;
      quality: quality;
      duration: number;
    },
    userId: string
  ) => Promise<Response>;

  generateVideo: (
    params: {
      message: string;
      imageBase64: string;
      size: size;
      quality: quality;
      duration: number;
    },
    userId: string
  ) => Promise<Response>;
};

export type apiUsage = {
  promptTokens: number;
  completionTokens: number;
};

export type deductionData = {
  user_id: string;
  model_id: string;
  input: string;
  output: number;
  amount: number;
};

export type candidate = {
  finishReason: string;
};

export type completion = {
  content?: string;
  reader?: ReadableStreamDefaultReader;
  error?: string;
};

export type completionParams = {
  messages: message[];
  modelKey: modelKey;
};

export type conversionRate = {
  inputRate?: number;
  imageInputRate?: number;
  outputRate?: number;
  amount?: number;
  amountPerSecond?: number;
};

export type error = {
  message: string;
};

export type message = {
  role: role;
  content: string;
};

export type messageObject = {
  messages: message[];
};

export type canvasObject = {
  message: string;
  imageBase64: string;
  size: size;
  quality: quality;
  duration: number;
};

export type canvasParams = {
  message: string;
  imageBase64: string;
  modelKey: modelKey;
  size: size;
  quality: quality;
  duration: number;
};

export type model = {
  key: modelKey;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  category: string;
};

export type canvasModel = {
  key: modelKey;
  label: string;
  type: string;
};

export type modelKey = string;

export type modelMap = {
  [modelKey: modelKey]: aiModule;
};

export type imageModelMap = {
  [modelKey: modelKey]: imageModule;
};

export type modelKeyMap = {
  [modelKey: modelKey]: string;
};

export type imagePrompt =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string; detail: string };

export type onCreditUpdateCallback = (value: number) => void;

export type onErrorCallback = (error: string) => void;

export type onUpdateCallback = (messages: message[], loading: boolean) => void;

export type openState = {
  state: boolean;
};

export type query = {
  model: string;
  messages: message[];
  stream?: boolean;
};

export type response = {
  data?: object;
  error?: error;
};

export type role = "user" | "assistant";

export type roles = { [K in role]: K };

export type session = {
  accessToken: string;
  userId: string;
  user: user;
};

export type stream = {
  reader?: ReadableStreamDefaultReader;
  error?: string;
};

export type streamController = ReadableStreamDefaultController;

export type streamResponse = Promise<stream>;

export type tokenPayload = {
  id: string;
};

export type tokenStatus = {
  token?: string;
  error?: string;
  refreshed?: boolean;
};

export type transactionData = {
  stripeTransactionId: string;
  amount: number;
  status: string;
  userId: string;
};

export type usage = {
  input?: number;
  output?: number;
  imageInput?: number;
  duration?: number;
};

export type user = {
  email: string;
  amount: number;
};

export type userAccount = {
  userId: string;
  email: string;
  amount: number;
};

export type settings = {
  key: string;
  label: string;
};

export type size =
  | "auto"
  | "1024x1024"
  | "1536x1024"
  | "1024x1536"
  | "256x256"
  | "512x512"
  | "1792x1024"
  | "1024x1792"
  | null
  | undefined;

export type quality =
  | "auto"
  | "standard"
  | "hd"
  | "low"
  | "medium"
  | "high"
  | null
  | undefined;

export type replicateResponse = {
  url: () => string;
};
