// color-picker.tsx
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-8 w-8 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="font-mono"
      />
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 p-0"
      />
    </div>
  );
}

// file-uploader.tsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  accept: string;
  maxFiles: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUploader({
  accept,
  maxFiles,
  onFilesSelected,
  disabled = false,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, maxFiles);
      onFilesSelected(fileArray);

      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6">
      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="mb-2 text-sm font-medium">
        {disabled ? "Max files reached" : "Drag and drop or click to upload"}
      </p>
      <p className="text-xs text-muted-foreground">
        {accept.replace("*", "").replace("/", "")} file{maxFiles > 1 ? "s" : ""}{" "}
        (max {maxFiles})
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={handleClick}
        disabled={disabled}
      >
        Upload
      </Button>
      <input
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
}
