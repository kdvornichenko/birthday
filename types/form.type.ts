export type TFormItem = {
    id: string;
    type: 'radio' | 'checkbox' | 'input' | 'textarea';
    options?: {
        value: string;
        isDefault?: boolean;
        onChange?: (value: string) => void;
    }[];
};

export type TFormFieldsTranslation = Record<
    string,
    | string
    | {
        label: string;
        options: Record<string, string>;
        textarea?: string;
    }
>;
