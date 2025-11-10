export interface DescriptionItem {
  value: string;
  label: string;
  span?: number;
}

export interface DescriptionProps {
  title?: string;
  data?: DescriptionItem[];
}
