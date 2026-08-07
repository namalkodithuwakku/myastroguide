declare module "html2pdf.js" {
  type Options = Record<string, unknown>;
  interface Worker {
    set(options: Options): Worker;
    from(element: HTMLElement): Worker;
    toPdf(): Worker;
    outputPdf(type: "blob"): Promise<Blob>;
    save(): Promise<void>;
  }
  export default function html2pdf(): Worker;
}
