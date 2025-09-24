export interface SingleImageDragOptions {
    accept: string | string[];
    ajax_url?: string;
    crop: boolean;
    width: number;
    height: number;
    max_width?: number;
    min_width?: number;
    max_height?: number;
    min_height?: number;
    modalTarget?: string;
}
