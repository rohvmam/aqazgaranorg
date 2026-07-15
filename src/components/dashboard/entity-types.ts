/** Serializable column definition (safe to pass server → client). */
export type ColumnDef = {
  key: string;
  labelEn: string;
  labelFa: string;
  type?:
    | "text"
    | "money"
    | "number"
    | "date"
    | "badge"
    | "percent"
    | "boolean"
    | "relation";
  /** key is a base name resolved to `${key}En` / `${key}Fa` by locale */
  localePair?: boolean;
};

export type FieldOption = { value: string; labelEn: string; labelFa: string };

/** Serializable form field definition for the CRUD dialog. */
export type FieldDef = {
  name: string;
  labelEn: string;
  labelFa: string;
  type: "text" | "email" | "number" | "date" | "textarea" | "select" | "switch";
  options?: FieldOption[];
  /** Populate a select from another entity's records (value = record id) */
  optionsFrom?: { entity: string; labelBase: "name" | "title" };
  required?: boolean;
  /** Force LTR input (emails, URLs, codes) */
  ltr?: boolean;
  /** Span both columns of the dialog grid */
  wide?: boolean;
};

export type EntityManagerConfig = {
  entity: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  /** Hide the create button / row mutations (read-only modules) */
  readOnly?: boolean;
  /** Rows can be edited/deleted but not created (inbox-style modules) */
  noCreate?: boolean;
};
