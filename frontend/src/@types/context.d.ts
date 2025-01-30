export interface Entry {
  id?: string;
  title: string;
  description: string;
  created_at: Date | string;
  scheduled: Date | string;
}
export type EntryContextType = {
  entries: Entry[];
  saveEntry: (entry: Entry) => void;
  updateEntry: (id: string, entryData: Entry) => void;
  deleteEntry: (id: string) => void;
};

export type ThemeMode = "light" | "dark";

export type ThemeContextType = {
  mode: ThemeMode;
  toggleMode: () => void;
};
