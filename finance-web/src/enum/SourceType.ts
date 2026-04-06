export const SourceType = {"Outro": 0, "Entretenimento": 1, "Serviço": 2, "Educação": 3, "Trabalho": 4, "Transporte": 5, "Casa": 6} as const;

export type SourceTypeValue = (typeof SourceType)[keyof typeof SourceType];