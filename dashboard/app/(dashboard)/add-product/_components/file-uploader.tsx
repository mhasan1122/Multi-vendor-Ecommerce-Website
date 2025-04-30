"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept?: string;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUploader({
  accept,
  maxFiles = 1,
  onFilesSelected,
  disabled = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Filter by accepted file types if specified
    let filteredFiles = accept
      ? files.filter((file) => {
          const fileType = file.type;
          return accept.split(",").some((type) => {
            return fileType.match(
              new RegExp(type.replace("*", ".*").replace("/", "\\/"), "i"),
            );
          });
        })
      : files;

    // Limit to max files
    filteredFiles = filteredFiles.slice(0, maxFiles);

    if (filteredFiles.length > 0) {
      onFilesSelected(filteredFiles);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20",
        disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary/50",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={disabled ? undefined : handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop{" "}
          {accept?.includes("image")
            ? "images"
            : accept?.includes("video")
              ? "videos"
              : "files"}{" "}
          here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          {maxFiles > 1 ? `Up to ${maxFiles} files` : "1 file"} allowed
        </p>
      </div>
    </div>
  );
}
